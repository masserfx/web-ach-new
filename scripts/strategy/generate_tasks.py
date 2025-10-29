#!/usr/bin/env python3
"""Generate strategy tasks from strategy document using Claude."""

import argparse
import json
import logging
import sys
from pathlib import Path

from anthropic import Anthropic
from config import settings
from db import db

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def read_strategy_document(doc_path: Path) -> str:
    """Read strategy document."""
    try:
        with open(doc_path, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        logger.error(f"Strategy document not found: {doc_path}")
        sys.exit(1)


def generate_tasks_with_claude(strategy_content: str) -> list:
    """Use Claude to generate tasks from strategy document."""
    client = Anthropic(api_key=settings.anthropic_api_key)

    prompt = f"""
Analyze this AC Heating strategy document and generate a list of implementation tasks.

STRATEGY DOCUMENT:
{strategy_content[:5000]}  # First 5000 chars

Generate tasks as JSON array. Each task should have:
- title: Clear task title
- description: Detailed description
- category: One of (content, seo, product, marketing, technical, ux, business)
- priority: 1-5 (1=critical, 5=low)
- agent_name: Suggested agent (content_writer, seo_specialist, product_manager, marketing_copy)
- estimated_hours: Estimated time to complete
- strategy_section: Reference to section in document

Return ONLY valid JSON array, no other text.

Example format:
[
  {{
    "title": "Create blog post about heat pumps",
    "description": "...",
    "category": "content",
    "priority": 1,
    "agent_name": "content_writer",
    "estimated_hours": 4,
    "strategy_section": "7.1 SEO and content marketing"
  }}
]
"""

    logger.info("Calling Claude to generate tasks...")
    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = response.content[0].text

    # Extract JSON from response
    try:
        import re

        json_match = re.search(r"\[.*\]", response_text, re.DOTALL)
        if json_match:
            tasks = json.loads(json_match.group())
            logger.info(f"Generated {len(tasks)} tasks")
            return tasks
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Claude response as JSON: {e}")
        logger.debug(f"Response: {response_text}")

    return []


def save_tasks_to_database(tasks: list) -> int:
    """Save generated tasks to database."""
    db.connect()
    saved_count = 0

    try:
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
                "agent_type": task.get("agent_type"),
                "estimated_hours": task.get("estimated_hours", 1.0),
                "status": "backlog",
                "progress": 0,
                "requires_approval": True,
            }

            # Insert task
            task_id = db.insert("strategy_tasks", task_data)
            if task_id:
                saved_count += 1
                logger.info(f"Created task: {task_data['title']} (ID: {task_id})")
            else:
                logger.warning(f"Failed to create task: {task_data['title']}")

    finally:
        db.disconnect()

    return saved_count


def main(strategy_doc_path: Path = None, dry_run: bool = False) -> bool:
    """Main function."""
    if strategy_doc_path is None:
        strategy_doc_path = settings.strategy_doc_path

    logger.info("Starting task generation...")
    logger.info(f"Strategy document: {strategy_doc_path}")

    # Read strategy
    strategy_content = read_strategy_document(strategy_doc_path)

    # Generate tasks using Claude
    tasks = generate_tasks_with_claude(strategy_content)

    if not tasks:
        logger.error("No tasks generated")
        return False

    logger.info(f"Generated {len(tasks)} tasks")

    if dry_run:
        logger.info("DRY RUN - Tasks not saved to database")
        logger.info("Generated tasks:")
        for task in tasks:
            logger.info(f"  - {task['title']} ({task['category']})")
        return True

    # Save to database
    saved_count = save_tasks_to_database(tasks)
    logger.info(f"Saved {saved_count}/{len(tasks)} tasks to database")

    return saved_count > 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate strategy tasks using Claude")
    parser.add_argument(
        "--doc-path",
        type=Path,
        default=None,
        help="Path to strategy document",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without saving to database",
    )
    args = parser.parse_args()

    success = main(args.doc_path, args.dry_run)
    sys.exit(0 if success else 1)
