#!/usr/bin/env python3
"""Run the Strategy Orchestrator to execute tasks with Neo4j integration."""

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
    logger.info(f"Neo4j enabled: {settings.neo4j_enabled}")

    # Connect to database
    try:
        db.connect()
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return False

    # Initialize Neo4j if enabled
    neo4j_conn = None
    learning_system = None
    
    if settings.neo4j_enabled:
        try:
            from neo4j_db import init_neo4j
            from learning_system import LearningSystem
            
            neo4j_conn = init_neo4j(
                uri=settings.neo4j_uri,
                user=settings.neo4j_user,
                password=settings.neo4j_password
            )
            learning_system = LearningSystem(neo4j_conn)
            logger.info("Neo4j and Learning System initialized successfully")
        except ImportError as e:
            logger.warning(f"Neo4j driver not installed: {e}")
            logger.warning("Install with: uv add neo4j")
            logger.info("Continuing without Neo4j integration")
        except Exception as e:
            logger.error(f"Failed to initialize Neo4j: {e}")
            logger.info("Continuing without Neo4j integration")

    # Initialize orchestrator
    orchestrator = StrategyOrchestrator(
        neo4j_conn=neo4j_conn,
        learning_system=learning_system
    )

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

                # Get status report with Neo4j insights
                status_report = orchestrator.get_status_report()
                
                # Save report if requested
                if report_file:
                    full_report = {
                        "batch_results": results,
                        "status_report": status_report
                    }
                    with open(report_file, "w") as f:
                        json.dump(full_report, f, indent=2, default=str)
                    logger.info(f"Report saved to {report_file}")
                
                # Log Neo4j insights if available
                if "neo4j_insights" in status_report:
                    logger.info("Neo4j Performance Insights:")
                    for agent_name, perf in status_report["neo4j_insights"].items():
                        logger.info(f"  {agent_name}: {perf.get('total_executions', 0)} executions")

            if not continuous:
                break

            logger.info(f"Waiting {interval} seconds before next cycle...")
            time.sleep(interval)

    except KeyboardInterrupt:
        logger.info("Orchestration interrupted by user")
        return False

    except Exception as e:
        logger.error(f"Error during orchestration: {e}", exc_info=True)
        return False

    finally:
        db.disconnect()
        if neo4j_conn:
            neo4j_conn.close()

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
