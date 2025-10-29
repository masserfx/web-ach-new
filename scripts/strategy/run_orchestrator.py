#!/usr/bin/env python3
"""Run the Strategy Orchestrator to execute tasks."""

import argparse
import json
import logging
import sys
import time

from config import settings
from db import db
from orchestrator import StrategyOrchestrator

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def main(
    limit: int = 5,
    dry_run: bool = False,
    continuous: bool = False,
    interval: int = 60,
    report_file: str = None,
) -> bool:
    """Main function."""
    logger.info("Starting Strategy Orchestrator")
    logger.info(f"Configuration: limit={limit}, dry_run={dry_run}, continuous={continuous}")

    # Connect to database
    try:
        db.connect()
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return False

    # Initialize orchestrator
    orchestrator = StrategyOrchestrator()

    try:
        while True:
            logger.info("=" * 60)
            logger.info("Starting orchestration cycle")

            # Get next tasks
            tasks = orchestrator.get_next_tasks(limit)
            if not tasks:
                logger.info("No tasks to execute")
                if not continuous:
                    break
                logger.info(f"Waiting {interval} seconds before next cycle...")
                time.sleep(interval)
                continue

            logger.info(f"Found {len(tasks)} tasks to execute")

            if dry_run:
                logger.info("DRY RUN - Tasks not executed")
                for task in tasks:
                    logger.info(f"  - {task['title']} (agent: {task.get('agent_name')})")
            else:
                # Execute batch
                results = orchestrator.execute_batch(limit)
                logger.info(
                    f"Batch execution complete: {results['succeeded']} succeeded, "
                    f"{results['failed']} failed"
                )

                # Save report if requested
                if report_file:
                    with open(report_file, "w") as f:
                        json.dump(results, f, indent=2, default=str)
                    logger.info(f"Report saved to {report_file}")

            if not continuous:
                break

            logger.info(f"Waiting {interval} seconds before next cycle...")
            time.sleep(interval)

    except KeyboardInterrupt:
        logger.info("Orchestration interrupted by user")
        return False

    except Exception as e:
        logger.error(f"Error during orchestration: {e}")
        return False

    finally:
        db.disconnect()

    logger.info("Orchestration complete")
    return True


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the Strategy Orchestrator")
    parser.add_argument(
        "--limit",
        type=int,
        default=5,
        help="Number of tasks to execute per batch",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run without executing tasks",
    )
    parser.add_argument(
        "--continuous",
        action="store_true",
        help="Run continuously in a loop",
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=60,
        help="Interval in seconds between batches (continuous mode)",
    )
    parser.add_argument(
        "--report",
        type=str,
        default=None,
        help="Save execution report to file",
    )
    args = parser.parse_args()

    success = main(
        limit=args.limit,
        dry_run=args.dry_run,
        continuous=args.continuous,
        interval=args.interval,
        report_file=args.report,
    )

    sys.exit(0 if success else 1)
