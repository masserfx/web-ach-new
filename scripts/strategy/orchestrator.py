"""Orchestrator for managing agent execution and workflow."""

import logging
from typing import Any, Dict, List, Optional

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
    """Orchestrates task execution using specialized agents."""

    def __init__(self):
        """Initialize orchestrator."""
        self.agents = {
            "content_writer": ContentWriterAgent(),
            "seo_specialist": SEOSpecialistAgent(),
            "product_manager": ProductManagerAgent(),
            "marketing_copy": MarketingCopyAgent(),
        }

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

    def execute_task(self, task: Dict[str, Any], trigger_source: str = "workflow") -> Dict[str, Any]:
        """Execute a single task."""
        task_id = task.get("id")
        agent_name = task.get("agent_name")

        if not self.can_execute_task(task):
            logger.warning(f"Cannot execute task {task_id}")
            return {"success": False, "task_id": task_id, "error": "Task cannot be executed"}

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
        result = agent.execute_task(
            task_id=task_id,
            task_data=task,
            trigger_source=trigger_source,
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
        """Get overall orchestration status."""
        # Count tasks by status
        all_tasks = db.execute("SELECT status, COUNT(*) as count FROM strategy_tasks GROUP BY status")
        status_counts = {item["status"]: item["count"] for item in all_tasks}

        # Get agent performance
        agent_performance = db.execute(
            "SELECT agent_name, tasks_completed, avg_quality_score, success_rate "
            "FROM agent_skills WHERE active = true"
        )

        return {
            "timestamp": "2024-10-29",
            "status_breakdown": status_counts,
            "agent_performance": agent_performance,
            "total_tasks": sum(status_counts.values()),
            "completion_rate": status_counts.get("done", 0) / max(sum(status_counts.values()), 1),
        }
