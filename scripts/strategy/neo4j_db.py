"""Neo4j database connection and graph operations."""

import logging
from typing import Any, Dict, List, Optional
from contextlib import contextmanager
from datetime import datetime

from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable

logger = logging.getLogger(__name__)


class Neo4jConnection:
    """Neo4j database connection manager."""

    def __init__(self, uri: str, user: str, password: str):
        """Initialize Neo4j connection."""
        self.uri = uri
        self.user = user
        self.password = password
        self._driver = None

    def connect(self) -> None:
        """Establish connection to Neo4j."""
        try:
            self._driver = GraphDatabase.driver(
                self.uri, 
                auth=(self.user, self.password)
            )
            # Test connection
            with self._driver.session() as session:
                result = session.run("RETURN 1 as test")
                result.single()
            logger.info(f"Connected to Neo4j at {self.uri}")
        except ServiceUnavailable as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise

    def close(self) -> None:
        """Close Neo4j connection."""
        if self._driver:
            self._driver.close()
            logger.info("Disconnected from Neo4j")

    @contextmanager
    def session(self):
        """Context manager for Neo4j session."""
        if not self._driver:
            self.connect()
        
        session = self._driver.session()
        try:
            yield session
        finally:
            session.close()

    def create_indexes(self) -> None:
        """Create necessary indexes for performance."""
        indexes = [
            "CREATE INDEX IF NOT EXISTS FOR (a:Agent) ON (a.name)",
            "CREATE INDEX IF NOT EXISTS FOR (t:Task) ON (t.task_id)",
            "CREATE INDEX IF NOT EXISTS FOR (e:Execution) ON (e.execution_id)",
            "CREATE INDEX IF NOT EXISTS FOR (l:Learning) ON (l.pattern_type)",
            "CREATE INDEX IF NOT EXISTS FOR (p:Pattern) ON (p.description)",
        ]
        
        with self.session() as session:
            for index_query in indexes:
                session.run(index_query)
        logger.info("Created Neo4j indexes")

    def create_agent_node(self, agent_data: Dict[str, Any]) -> None:
        """Create or update Agent node."""
        query = """
        MERGE (a:Agent {name: $name})
        SET a.agent_type = $agent_type,
            a.capabilities = $capabilities,
            a.active = $active,
            a.tasks_completed = $tasks_completed,
            a.avg_quality_score = $avg_quality_score,
            a.success_rate = $success_rate,
            a.updated_at = datetime()
        RETURN a
        """
        
        with self.session() as session:
            session.run(query, **agent_data)
        logger.info(f"Created/updated Agent node: {agent_data['name']}")

    def create_task_node(self, task_data: Dict[str, Any]) -> None:
        """Create or update Task node."""
        query = """
        MERGE (t:Task {task_id: $task_id})
        SET t.title = $title,
            t.description = $description,
            t.status = $status,
            t.priority = $priority,
            t.category = $category,
            t.tags = $tags,
            t.created_at = $created_at,
            t.updated_at = datetime()
        RETURN t
        """
        
        with self.session() as session:
            session.run(query, **task_data)
        logger.info(f"Created/updated Task node: {task_data['task_id']}")

    def create_execution_node(self, execution_data: Dict[str, Any]) -> None:
        """Create Execution node and relationships."""
        query = """
        CREATE (e:Execution {
            execution_id: $execution_id,
            started_at: $started_at,
            completed_at: datetime(),
            status: $status,
            quality_score: $quality_score,
            tokens_used: $tokens_used,
            api_cost: $api_cost,
            model_used: $model_used,
            trigger_source: $trigger_source
        })
        
        WITH e
        MATCH (a:Agent {name: $agent_name})
        CREATE (a)-[:EXECUTED {timestamp: datetime()}]->(e)
        
        WITH e, a
        MATCH (t:Task {task_id: $task_id})
        CREATE (e)-[:FOR_TASK {timestamp: datetime()}]->(t)
        CREATE (a)-[:ASSIGNED_TO {timestamp: datetime()}]->(t)
        
        RETURN e
        """
        
        with self.session() as session:
            session.run(query, **execution_data)
        logger.info(f"Created Execution node: {execution_data['execution_id']}")

    def create_learning_node(self, learning_data: Dict[str, Any]) -> None:
        """Create Learning node from execution feedback."""
        query = """
        CREATE (l:Learning {
            learning_id: $learning_id,
            execution_id: $execution_id,
            pattern_type: $pattern_type,
            feedback: $feedback,
            confidence: $confidence,
            impact_score: $impact_score,
            created_at: datetime()
        })
        
        WITH l
        MATCH (e:Execution {execution_id: $execution_id})
        CREATE (e)-[:GENERATED {timestamp: datetime()}]->(l)
        
        RETURN l
        """
        
        with self.session() as session:
            session.run(query, **learning_data)
        logger.info(f"Created Learning node: {learning_data['learning_id']}")

    def get_agent_performance(self, agent_name: str) -> Dict[str, Any]:
        """Get agent performance metrics from graph."""
        query = """
        MATCH (a:Agent {name: $agent_name})-[:EXECUTED]->(e:Execution)
        RETURN 
            a.name as agent_name,
            count(e) as total_executions,
            avg(e.quality_score) as avg_quality,
            sum(e.tokens_used) as total_tokens,
            sum(e.api_cost) as total_cost
        """
        
        with self.session() as session:
            result = session.run(query, agent_name=agent_name)
            record = result.single()
            if record:
                return dict(record)
        return {}

    def get_task_history(self, task_id: str) -> List[Dict[str, Any]]:
        """Get complete execution history for a task."""
        query = """
        MATCH (t:Task {task_id: $task_id})<-[:FOR_TASK]-(e:Execution)<-[:EXECUTED]-(a:Agent)
        OPTIONAL MATCH (e)-[:GENERATED]->(l:Learning)
        RETURN 
            e.execution_id as execution_id,
            e.started_at as started_at,
            e.status as status,
            e.quality_score as quality_score,
            a.name as agent_name,
            collect(l.pattern_type) as learned_patterns
        ORDER BY e.started_at DESC
        """
        
        with self.session() as session:
            result = session.run(query, task_id=task_id)
            return [dict(record) for record in result]


# Global Neo4j instance
neo4j_db = None


def init_neo4j(uri: str, user: str, password: str) -> Neo4jConnection:
    """Initialize global Neo4j connection."""
    global neo4j_db
    neo4j_db = Neo4jConnection(uri, user, password)
    neo4j_db.connect()
    neo4j_db.create_indexes()
    return neo4j_db
