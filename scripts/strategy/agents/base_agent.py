"""Base agent class for Strategy Orchestrator."""

import json
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, Optional

from anthropic import Anthropic

from config import settings
from db import db
from models import ExecutionStatus, ExecutionType

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """Base class for all strategy agents."""

    def __init__(self, agent_name: str, agent_type: str):
        """Initialize agent."""
        self.agent_name = agent_name
        self.agent_type = agent_type
        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.anthropic_model
        self.max_tokens = settings.anthropic_max_tokens

        # Load agent configuration from database
        self._load_config()

    def _load_config(self) -> None:
        """Load agent configuration from database."""
        agent_data = db.get_agent(self.agent_name)
        if agent_data:
            self.system_prompt = agent_data.get("system_prompt", "")
            self.model = agent_data.get("model", self.model)
            self.max_tokens = agent_data.get("max_tokens", self.max_tokens)
            self.temperature = agent_data.get("temperature", 1.0)
            logger.info(f"Loaded configuration for agent: {self.agent_name}")
        else:
            logger.warning(f"Agent configuration not found: {self.agent_name}")
            self.system_prompt = ""
            self.temperature = 1.0

    @abstractmethod
    def generate_prompt(self, task_data: Dict[str, Any]) -> str:
        """Generate prompt for the agent based on task data."""
        pass

    @abstractmethod
    def process_output(self, output: str) -> Dict[str, Any]:
        """Process AI output into structured format."""
        pass

    def execute_task(
        self,
        task_id: str,
        task_data: Dict[str, Any],
        trigger_source: str = "manual",
    ) -> Dict[str, Any]:
        """Execute a task using the agent."""
        start_time = datetime.utcnow()
        execution_log_id = None

        try:
            # Generate prompt
            user_prompt = self.generate_prompt(task_data)

            logger.info(f"Executing task {task_id} with agent {self.agent_name}")

            # Call Claude API
            response = self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                system=self.system_prompt,
                temperature=self.temperature,
                messages=[{"role": "user", "content": user_prompt}],
            )

            # Extract response
            assistant_message = response.content[0].text
            usage = response.usage

            # Process output
            processed_output = self.process_output(assistant_message)

            # Calculate metrics
            duration_ms = int((datetime.utcnow() - start_time).total_seconds() * 1000)
            api_cost = self._calculate_cost(
                input_tokens=usage.input_tokens,
                output_tokens=usage.output_tokens,
            )

            # Convert Decimal to float for JSON serialization
            output_for_json = json.loads(json.dumps(processed_output, default=str))

            # Log execution
            execution_log_id = db.log_execution(
                task_id=task_id,
                agent_name=self.agent_name,
                execution_type=ExecutionType.GENERATION.value,
                trigger_source=trigger_source or "workflow",
                status=ExecutionStatus.SUCCESS.value,
                input_prompt=user_prompt,
                output_data=output_for_json,
                tokens_used=usage.input_tokens + usage.output_tokens,
                api_cost=float(api_cost),
                quality_score=float(processed_output.get("quality_score", 0)),
            )

            # Update task status
            db.update(
                "strategy_tasks",
                {
                    "status": "review",
                    "output_data": json.dumps(output_for_json),
                    "progress": 80,
                    "quality_score": float(processed_output.get("quality_score", 0)),
                    "actual_hours": duration_ms / (1000 * 60 * 60),
                },
                {"id": task_id},
            )

            logger.info(
                f"Task {task_id} executed successfully. "
                f"Tokens: {usage.input_tokens + usage.output_tokens}, "
                f"Cost: ${api_cost:.4f}"
            )

            return {
                "success": True,
                "task_id": task_id,
                "execution_log_id": execution_log_id,
                "output": processed_output,
                "tokens_used": usage.input_tokens + usage.output_tokens,
                "api_cost": api_cost,
                "duration_ms": duration_ms,
            }

        except Exception as e:
            logger.error(f"Error executing task {task_id}: {str(e)}")

            # Log error
            execution_log_id = db.log_execution(
                task_id=task_id,
                agent_name=self.agent_name,
                execution_type=ExecutionType.GENERATION.value,
                trigger_source=trigger_source or "workflow",
                status=ExecutionStatus.FAILED.value,
                error_message=str(e),
            )

            # Update task status
            db.update(
                "strategy_tasks",
                {
                    "status": "blocked",
                    "progress": 0,
                },
                {"id": task_id},
            )

            return {
                "success": False,
                "task_id": task_id,
                "execution_log_id": execution_log_id,
                "error": str(e),
            }

    def _calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        """Calculate API cost based on token usage.

        Pricing for Claude Sonnet 4.5:
        - Input: $3 per 1M tokens
        - Output: $15 per 1M tokens
        """
        input_cost = (input_tokens / 1_000_000) * 3
        output_cost = (output_tokens / 1_000_000) * 15
        return input_cost + output_cost
