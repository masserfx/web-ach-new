#!/usr/bin/env python3
"""Generate strategy implementation progress reports."""

import argparse
import json
import logging
import sys
from datetime import datetime
from pathlib import Path

from db import db

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def generate_report(output_file: Path = None, format: str = "json") -> dict:
    """Generate comprehensive progress report."""
    logger.info("Generating strategy implementation report")

    # Connect to database
    try:
        db.connect()
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return {}

    try:
        # Get task statistics
        task_stats = db.execute(
            """
            SELECT
                status,
                COUNT(*) as count,
                AVG(quality_score) as avg_quality,
                AVG(progress) as avg_progress
            FROM strategy_tasks
            GROUP BY status
            """
        )

        # Get agent performance
        agent_stats = db.execute(
            """
            SELECT
                agent_name,
                tasks_completed,
                ROUND(avg_quality_score::numeric, 2) as avg_quality_score,
                ROUND(success_rate::numeric, 2) as success_rate
            FROM agent_skills
            WHERE active = true
            ORDER BY tasks_completed DESC
            """
        )

        # Get category breakdown
        category_stats = db.execute(
            """
            SELECT
                category,
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'done') as completed,
                ROUND(COUNT(*) FILTER (WHERE status = 'done')::numeric / COUNT(*) * 100, 2) as percentage
            FROM strategy_tasks
            GROUP BY category
            ORDER BY percentage DESC
            """
        )

        # Get milestone progress
        milestones = db.execute(
            """
            SELECT
                name,
                phase,
                status,
                progress_percentage,
                completed_tasks,
                total_tasks
            FROM strategy_milestones
            ORDER BY target_date ASC
            """
        )

        # Get recent execution logs
        recent_logs = db.execute(
            """
            SELECT
                agent_name,
                execution_type,
                status,
                tokens_used,
                api_cost,
                started_at
            FROM execution_logs
            ORDER BY started_at DESC
            LIMIT 20
            """
        )

        # Calculate totals
        total_tasks = sum(row["count"] for row in task_stats)
        completed_tasks = next(
            (row["count"] for row in task_stats if row["status"] == "done"), 0
        )
        total_cost = sum(log.get("api_cost") or 0 for log in recent_logs)
        total_tokens = sum(log.get("tokens_used") or 0 for log in recent_logs)

        # Build report
        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "summary": {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
                "total_cost_usd": round(total_cost, 2),
                "total_tokens_used": total_tokens,
            },
            "task_status": {row["status"]: row["count"] for row in task_stats},
            "task_quality": {
                row["status"]: {
                    "avg_quality": round(row.get("avg_quality") or 0, 2),
                    "avg_progress": round(row.get("avg_progress") or 0, 2),
                }
                for row in task_stats
            },
            "agent_performance": [
                {
                    "agent": row["agent_name"],
                    "tasks_completed": row["tasks_completed"],
                    "avg_quality_score": row["avg_quality_score"],
                    "success_rate": row["success_rate"],
                }
                for row in agent_stats
            ],
            "category_breakdown": [
                {
                    "category": row["category"],
                    "total": row["total"],
                    "completed": row["completed"],
                    "percentage": row["percentage"],
                }
                for row in category_stats
            ],
            "milestones": [
                {
                    "name": row["name"],
                    "phase": row["phase"],
                    "status": row["status"],
                    "progress": row["progress_percentage"],
                    "tasks": f"{row['completed_tasks']}/{row['total_tasks']}",
                }
                for row in milestones
            ],
        }

        logger.info(f"Report generated: {completed_tasks}/{total_tasks} tasks completed")

        # Save report if requested
        if output_file:
            output_file = Path(output_file)
            output_file.parent.mkdir(parents=True, exist_ok=True)

            if format == "json":
                with open(output_file, "w") as f:
                    json.dump(report, f, indent=2, default=str)
            elif format == "html":
                html_content = generate_html_report(report)
                with open(output_file, "w") as f:
                    f.write(html_content)
            else:
                logger.warning(f"Unknown format: {format}")

            logger.info(f"Report saved to {output_file}")

        return report

    finally:
        db.disconnect()


def generate_html_report(report: dict) -> str:
    """Generate HTML report from data."""
    summary = report["summary"]

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>AC Heating Strategy Implementation Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }}
            .container {{ max-width: 1000px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }}
            h1 {{ color: #333; }}
            .summary {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }}
            .stat-box {{ background-color: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; }}
            .stat-number {{ font-size: 24px; font-weight: bold; color: #F36F21; }}
            .stat-label {{ font-size: 12px; color: #666; margin-top: 5px; }}
            table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            th, td {{ padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }}
            th {{ background-color: #f0f0f0; font-weight: bold; }}
            .progress-bar {{ width: 100%; height: 20px; background-color: #ddd; border-radius: 10px; overflow: hidden; }}
            .progress-fill {{ height: 100%; background-color: #F36F21; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 AC Heating Strategy Implementation Report</h1>
            <p>Generated: {report['timestamp']}</p>

            <div class="summary">
                <div class="stat-box">
                    <div class="stat-number">{summary['completed_tasks']}/{summary['total_tasks']}</div>
                    <div class="stat-label">Tasks Completed</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">{summary['completion_rate']:.0f}%</div>
                    <div class="stat-label">Completion Rate</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${summary['total_cost_usd']}</div>
                    <div class="stat-label">Total Cost</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">{summary['total_tokens_used']:,}</div>
                    <div class="stat-label">Tokens Used</div>
                </div>
            </div>

            <h2>Category Breakdown</h2>
            <table>
                <thead>
                    <tr><th>Category</th><th>Total</th><th>Completed</th><th>Progress</th></tr>
                </thead>
                <tbody>
    """

    for cat in report["category_breakdown"]:
        html += f"""
                    <tr>
                        <td>{cat['category']}</td>
                        <td>{cat['total']}</td>
                        <td>{cat['completed']}</td>
                        <td>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: {cat['percentage']}%"></div>
                            </div>
                            {cat['percentage']:.0f}%
                        </td>
                    </tr>
        """

    html += """
                </tbody>
            </table>

            <h2>Agent Performance</h2>
            <table>
                <thead>
                    <tr><th>Agent</th><th>Tasks Completed</th><th>Avg Quality</th><th>Success Rate</th></tr>
                </thead>
                <tbody>
    """

    for agent in report["agent_performance"]:
        html += f"""
                    <tr>
                        <td>{agent['agent']}</td>
                        <td>{agent['tasks_completed']}</td>
                        <td>{agent['avg_quality_score']}</td>
                        <td>{agent['success_rate']}%</td>
                    </tr>
        """

    html += """
                </tbody>
            </table>
        </div>
    </body>
    </html>
    """

    return html


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate strategy implementation report")
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output file path",
    )
    parser.add_argument(
        "--format",
        type=str,
        choices=["json", "html"],
        default="json",
        help="Output format",
    )
    args = parser.parse_args()

    report = generate_report(args.output, args.format)

    if not args.output:
        print(json.dumps(report, indent=2, default=str))

    sys.exit(0)
