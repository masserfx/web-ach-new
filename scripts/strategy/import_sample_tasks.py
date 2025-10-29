#!/usr/bin/env python3
"""Import sample tasks from JSON into database."""

import argparse
import json
import logging
import sys
from pathlib import Path

from db import db

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def load_sample_tasks(file_path: Path) -> list:
    """Load sample tasks from JSON file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error(f"Sample tasks file not found: {file_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in sample tasks file: {e}")
        sys.exit(1)


def import_tasks(file_path: Path = None, dry_run: bool = False) -> bool:
    """Import sample tasks into database."""
    if file_path is None:
        file_path = Path(__file__).parent / "sample_tasks.json"

    logger.info(f"Loading sample tasks from: {file_path}")
    tasks = load_sample_tasks(file_path)
    logger.info(f"Loaded {len(tasks)} sample tasks")

    # Connect to database (skip if dry_run)
    if not dry_run:
        try:
            db.connect()
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            return False

    try:
        saved_count = 0

        for task in tasks:
            # Prepare task data
            task_data = {
                "title": task.get("title"),
                "description": task.get("description"),
                "category": task.get("category", "business"),
                "priority": task.get("priority", 3),
                "strategy_section": task.get("strategy_section"),
                "strategy_document": "ac_heating_web_strategy.md",
                "agent_name": task.get("agent_name"),
                "estimated_hours": task.get("estimated_hours", 1.0),
                "status": "backlog",
                "progress": 0,
                "requires_approval": True,
            }

            if dry_run:
                logger.info(f"[DRY RUN] Would create: {task_data['title']}")
                saved_count += 1
            else:
                # Insert task
                task_id = db.insert("strategy_tasks", task_data)
                if task_id:
                    saved_count += 1
                    logger.info(f"Created task: {task_data['title']} (ID: {task_id})")
                else:
                    logger.warning(f"Failed to create task: {task_data['title']}")

        logger.info(f"Imported {saved_count}/{len(tasks)} tasks successfully")
        return True

    except Exception as e:
        logger.error(f"Error importing tasks: {e}")
        return False

    finally:
        if not dry_run:
            db.disconnect()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import sample tasks from JSON")
    parser.add_argument(
        "--file",
        type=Path,
        default=None,
        help="Path to sample tasks JSON file",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without saving to database",
    )
    args = parser.parse_args()

    success = import_tasks(args.file, args.dry_run)
    sys.exit(0 if success else 1)
