"""Database connection and query helpers."""

import logging
from typing import Any, Dict, List, Optional
from contextlib import contextmanager

import psycopg2
import psycopg2.extras
from psycopg2 import sql

from config import settings

logger = logging.getLogger(__name__)


class DatabaseConnection:
    """PostgreSQL database connection manager."""

    def __init__(self, settings_obj=None):
        """Initialize database connection."""
        self.settings = settings_obj or settings
        self.conn = None

    def connect(self) -> None:
        """Establish database connection."""
        try:
            sslmode = "require" if self.settings.db_ssl else "disable"
            self.conn = psycopg2.connect(
                host=self.settings.db_host,
                port=self.settings.db_port,
                database=self.settings.db_name,
                user=self.settings.db_user,
                password=self.settings.db_password,
                sslmode=sslmode,
            )
            self.conn.set_session(autocommit=True)
            logger.info(f"Connected to database at {self.settings.db_host}:{self.settings.db_port}")
        except psycopg2.Error as e:
            logger.error(f"Failed to connect to database: {e}")
            raise

    def disconnect(self) -> None:
        """Close database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Disconnected from database")

    @contextmanager
    def cursor(self):
        """Context manager for database cursor."""
        if not self.conn:
            self.connect()

        cursor = self.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        try:
            yield cursor
        finally:
            cursor.close()

    def execute(self, query: str, params: Optional[tuple] = None) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results."""
        from decimal import Decimal

        def convert_decimals(obj):
            """Convert Decimal objects to float."""
            if isinstance(obj, Decimal):
                return float(obj)
            elif isinstance(obj, dict):
                return {k: convert_decimals(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_decimals(item) for item in obj]
            return obj

        with self.cursor() as cur:
            if params:
                cur.execute(query, params)
            else:
                cur.execute(query)
            results = cur.fetchall() if cur.description else []
            return [convert_decimals(row) for row in results]

    def execute_one(self, query: str, params: Optional[tuple] = None) -> Optional[Dict[str, Any]]:
        """Execute a query and return single row."""
        results = self.execute(query, params)
        return results[0] if results else None

    def insert(self, table: str, data: Dict[str, Any]) -> str:
        """Insert a row and return the ID."""
        columns = data.keys()
        values = [data[col] for col in columns]
        placeholders = ", ".join(["%s"] * len(columns))

        query = sql.SQL("INSERT INTO {} ({}) VALUES ({}) RETURNING id").format(
            sql.Identifier(table),
            sql.SQL(", ").join(map(sql.Identifier, columns)),
            sql.SQL(placeholders),
        )

        with self.cursor() as cur:
            cur.execute(query, values)
            result = cur.fetchone()
            return result["id"] if result else None

    def update(self, table: str, data: Dict[str, Any], where: Dict[str, Any]) -> int:
        """Update rows in table."""
        set_clause = ", ".join([f"{k} = %s" for k in data.keys()])
        where_clause = " AND ".join([f"{k} = %s" for k in where.keys()])

        query = f"UPDATE {table} SET {set_clause} WHERE {where_clause}"
        params = list(data.values()) + list(where.values())

        with self.cursor() as cur:
            cur.execute(query, params)
            return cur.rowcount

    def get_agent(self, agent_name: str) -> Optional[Dict[str, Any]]:
        """Get agent by name."""
        query = "SELECT * FROM agent_skills WHERE agent_name = %s AND active = true"
        return self.execute_one(query, (agent_name,))

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task by ID."""
        query = "SELECT * FROM strategy_tasks WHERE id = %s"
        return self.execute_one(query, (task_id,))

    def get_tasks_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get tasks by status."""
        query = "SELECT * FROM strategy_tasks WHERE status = %s ORDER BY priority ASC, created_at DESC"
        return self.execute(query, (status,))

    def log_execution(
        self,
        task_id: str,
        agent_name: str,
        execution_type: str,
        trigger_source: str,
        status: str,
        input_prompt: Optional[str] = None,
        output_data: Optional[dict] = None,
        tokens_used: Optional[int] = None,
        api_cost: Optional[float] = None,
        error_message: Optional[str] = None,
        quality_score: Optional[float] = None,
    ) -> str:
        """Log task execution."""
        import json
        import datetime

        data = {
            "task_id": task_id,
            "agent_name": agent_name,
            "execution_type": execution_type,
            "trigger_source": trigger_source,
            "status": status,
            "input_prompt": input_prompt,
            "output_data": json.dumps(output_data) if output_data else None,
            "model_used": self.settings.anthropic_model,
            "tokens_used": tokens_used,
            "api_cost": api_cost,
            "error_message": error_message,
            "output_quality_score": quality_score,
            "started_at": datetime.datetime.utcnow().isoformat(),
        }

        return self.insert("execution_logs", data)


# Global database instance
db = DatabaseConnection()
