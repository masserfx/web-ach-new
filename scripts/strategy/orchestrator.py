"""Orchestrator for managing agent execution and workflow with Neo4j integration."""

import logging
from typing import Any, Dict, List, Optional
import uuid

from db import db
from models import TaskStatus
from agents import (
    ContentWriterAgent,
    SEOSpecialistAgent,
    ProductManagerAgent,
    MarketingCopyAgent,
)

logger = logging.getLogger(__name__)


class StrategyOrchestrator:
    """Orchestrates task execution using specialized agents with Neo4j tracking."""

    def __init__(self, neo4j_conn=None, learning_system=None):
        """Initialize orchestrator with optional Neo4j and learning system."""
        self.agents = {
            "content_writer": ContentWriterAgent(),
            "seo_specialist": SEOSpecialistAgent(),
            "product_manager": ProductManagerAgent(),
            "marketing_copy": MarketingCopyAgent(),
        }
        
        self.neo4j = neo4j_conn
        self.learning = learning_system
        
        # Initialize agent nodes in Neo4j if enabled
        if self.neo4j:
            self._init_agent_nodes()

    def _init_agent_nodes(self) -> None:
        """Initialize agent nodes in Neo4j."""
        for agent_name, agent in self.agents.items():
            # Get agent info from PostgreSQL
            agent_info = db.get_agent(agent_name)
            if agent_info:
                self.neo4j.create_agent_node({
                    "name": agent_name,
                    "agent_type": agent_info.get("agent_type", "ai_agent"),
                    "capabilities": agent_info.get("capabilities", ""),
                    "active": agent_info.get("active", True),
                    "tasks_completed": agent_info.get("tasks_completed", 0),
                    "avg_quality_score": agent_info.get("avg_quality_score", 0.0),
                    "success_rate": agent_info.get("success_rate", 0.0)
                })
        logger.info("Initialized agent nodes in Neo4j")

    def get_next_tasks(self, limit: int = 5) -> List[Dict[str, Any]]:
        """Get next tasks to execute."""
        tasks = db.get_tasks_by_status(TaskStatus.BACKLOG.value)
        return tasks[:limit]

    def can_execute_task(self, task: Dict[str, Any]) -> bool:
        """Check if task can be executed."""
        # Check if all dependencies are completed
        dependencies = task.get("dependencies", [])
        if dependencies:
            for dep_id in dependencies:
                dep_task = db.get_task(dep_id)
                if dep_task and dep_task["status"] != "done":
                    logger.warning(f"Task {task['id']} has incomplete dependency: {dep_id}")
                    return False

        # Check if agent is assigned and available
        agent_name = task.get("agent_name")
        if not agent_name:
            logger.warning(f"Task {task['id']} has no assigned agent")
            return False

        if agent_name not in self.agents:
            logger.warning(f"Agent {agent_name} is not registered")
            return False

        return True

    def execute_task(
        self, 
        task: Dict[str, Any], 
        trigger_source: str = "workflow"
    ) -> Dict[str, Any]:
        """Execute a single task with Neo4j tracking."""
        task_id = task.get("id")
        agent_name = task.get("agent_name")

        if not self.can_execute_task(task):
            logger.warning(f"Cannot execute task {task_id}")
            return {"success": False, "task_id": task_id, "error": "Task cannot be executed"}

        # Get recommendations from learning system
        recommendations = []
        if self.learning:
            recommendations = self.learning.get_recommendations(task, agent_name)
            logger.info(f"Got {len(recommendations)} recommendations for task {task_id}")

        # Create task node in Neo4j
        if self.neo4j:
            self.neo4j.create_task_node({
                "task_id": task_id,
                "title": task.get("title", ""),
                "description": task.get("description", ""),
                "status": task.get("status", ""),
                "priority": task.get("priority", 0),
                "category": task.get("category", ""),
                "tags": task.get("tags", []),
                "created_at": task.get("created_at", "")
            })

        # Get agent
        agent = self.agents.get(agent_name)
        if not agent:
            return {"success": False, "task_id": task_id, "error": f"Agent {agent_name} not found"}

        # Update task status
        db.update(
            "strategy_tasks",
            {"status": TaskStatus.IN_PROGRESS.value, "progress": 20},
            {"id": task_id},
        )

        # Execute task
        execution_id = str(uuid.uuid4())
        result = agent.execute_task(
            task_id=task_id,
            task_data=task,
            trigger_source=trigger_source,
        )

        # Track execution in Neo4j
        if self.neo4j and result.get("success"):
            self.neo4j.create_execution_node({
                "execution_id": execution_id,
                "agent_name": agent_name,
                "task_id": task_id,
                "started_at": result.get("started_at", ""),
                "status": "success",
                "quality_score": result.get("quality_score", 0.8),
                "tokens_used": result.get("tokens_used", 0),
                "api_cost": result.get("api_cost", 0.0),
                "model_used": result.get("model_used", ""),
                "trigger_source": trigger_source
            })

        # Record learning if enabled
        if self.learning and result.get("success"):
            feedback_data = {
                "task_category": task.get("category", "general"),
                "agent_type": agent_name,
                "quality_delta": result.get("quality_score", 0.8) - 0.5,  # Improvement over baseline
                "performance_delta": 0.1  # Placeholder
            }
            self.learning.record_feedback(
                execution_id=execution_id,
                feedback_type="quality_improvement",
                feedback_data=feedback_data
            )

        return result

    def execute_batch(self, limit: int = 5) -> Dict[str, Any]:
        """Execute a batch of tasks."""
        tasks = self.get_next_tasks(limit)
        results = {
            "total": len(tasks),
            "succeeded": 0,
            "failed": 0,
            "tasks": [],
        }

        for task in tasks:
            logger.info(f"Processing task: {task['id']} - {task['title']}")
            result = self.execute_task(task)
            results["tasks"].append(result)

            if result.get("success"):
                results["succeeded"] += 1
            else:
                results["failed"] += 1

        return results

    def get_status_report(self) -> Dict[str, Any]:
        """Get overall orchestration status with Neo4j insights."""
        # Count tasks by status
        all_tasks = db.execute("SELECT status, COUNT(*) as count FROM strategy_tasks GROUP BY status")
        status_counts = {item["status"]: item["count"] for item in all_tasks}

        # Get agent performance from PostgreSQL
        agent_performance = db.execute(
            "SELECT agent_name, tasks_completed, avg_quality_score, success_rate "
            "FROM agent_skills WHERE active = true"
        )

        report = {
            "timestamp": "2024-10-29",
            "status_breakdown": status_counts,
            "agent_performance": agent_performance,
            "total_tasks": sum(status_counts.values()),
            "completion_rate": status_counts.get("done", 0) / max(sum(status_counts.values()), 1),
        }

        # Add Neo4j insights if available
        if self.neo4j:
            neo4j_insights = {}
            for agent_name in self.agents.keys():
                perf = self.neo4j.get_agent_performance(agent_name)
                if perf:
                    neo4j_insights[agent_name] = perf
            report["neo4j_insights"] = neo4j_insights

        # Add learning insights if available
        if self.learning:
            report["learning_insights"] = self.learning.export_learning_report()

        return report

    def get_task_insights(self, task_id: str) -> Dict[str, Any]:
        """Get detailed insights for a specific task from Neo4j."""
        if not self.neo4j:
            return {"error": "Neo4j not enabled"}

        history = self.neo4j.get_task_history(task_id)
        
        return {
            "task_id": task_id,
            "execution_count": len(history),
            "executions": history,
            "avg_quality": sum(e.get("quality_score", 0) for e in history) / max(len(history), 1),
            "learned_patterns": list(set(
                pattern 
                for e in history 
                for pattern in e.get("learned_patterns", [])
            ))
        }
