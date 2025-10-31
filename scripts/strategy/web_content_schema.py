"""Extended Neo4j schema for web content management."""

import logging
from typing import Any, Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class WebContentSchema:
    """Manage web content nodes and relationships in Neo4j."""

    def __init__(self, neo4j_conn):
        """Initialize with Neo4j connection."""
        self.neo4j = neo4j_conn

    def create_web_indexes(self) -> None:
        """Create indexes for web content."""
        indexes = [
            "CREATE INDEX IF NOT EXISTS FOR (a:Article) ON (a.slug)",
            "CREATE INDEX IF NOT EXISTS FOR (a:Article) ON (a.published_date)",
            "CREATE INDEX IF NOT EXISTS FOR (i:Image) ON (i.url)",
            "CREATE INDEX IF NOT EXISTS FOR (p:Page) ON (p.path)",
            "CREATE INDEX IF NOT EXISTS FOR (c:Category) ON (c.name)",
            "CREATE INDEX IF NOT EXISTS FOR (t:Tag) ON (t.name)",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (a:Article) REQUIRE a.id IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (i:Image) REQUIRE i.id IS UNIQUE",
            "CREATE CONSTRAINT IF NOT EXISTS FOR (p:Page) REQUIRE p.id IS UNIQUE",
        ]
        
        with self.neo4j.session() as session:
            for index_query in indexes:
                session.run(index_query)
        logger.info("Created web content indexes")

    def create_article_node(self, article_data: Dict[str, Any]) -> None:
        """Create Article node with metadata."""
        query = """
        MERGE (a:Article {id: $id})
        SET a.title = $title,
            a.slug = $slug,
            a.content = $content,
            a.excerpt = $excerpt,
            a.author = $author,
            a.published_date = $published_date,
            a.updated_date = datetime(),
            a.status = $status,
            a.word_count = $word_count,
            a.read_time = $read_time,
            a.seo_title = $seo_title,
            a.seo_description = $seo_description,
            a.views = $views,
            a.shares = $shares
        
        // Link to agent who created it
        WITH a
        MATCH (agent:Agent {name: $created_by})
        MERGE (agent)-[:CREATED {timestamp: datetime()}]->(a)
        
        RETURN a
        """
        
        with self.neo4j.session() as session:
            session.run(query, **article_data)
        logger.info(f"Created Article node: {article_data['title']}")

    def create_image_node(self, image_data: Dict[str, Any]) -> None:
        """Create Image node."""
        query = """
        MERGE (i:Image {id: $id})
        SET i.url = $url,
            i.alt_text = $alt_text,
            i.title = $title,
            i.width = $width,
            i.height = $height,
            i.file_size = $file_size,
            i.format = $format,
            i.uploaded_date = $uploaded_date,
            i.optimized = $optimized,
            i.cdn_url = $cdn_url
        
        RETURN i
        """
        
        with self.neo4j.session() as session:
            session.run(query, **image_data)
        logger.info(f"Created Image node: {image_data['url']}")

    def create_page_node(self, page_data: Dict[str, Any]) -> None:
        """Create Page node for website structure."""
        query = """
        MERGE (p:Page {id: $id})
        SET p.path = $path,
            p.title = $title,
            p.template = $template,
            p.layout = $layout,
            p.published = $published,
            p.created_date = $created_date,
            p.updated_date = datetime(),
            p.meta_title = $meta_title,
            p.meta_description = $meta_description,
            p.canonical_url = $canonical_url
        
        RETURN p
        """
        
        with self.neo4j.session() as session:
            session.run(query, **page_data)
        logger.info(f"Created Page node: {page_data['path']}")

    def create_category_node(self, category_data: Dict[str, Any]) -> None:
        """Create Category taxonomy node."""
        query = """
        MERGE (c:Category {name: $name})
        SET c.slug = $slug,
            c.description = $description,
            c.parent_category = $parent_category
        
        RETURN c
        """
        
        with self.neo4j.session() as session:
            session.run(query, **category_data)

    def link_article_to_images(self, article_id: str, image_ids: List[str]) -> None:
        """Link article to its images."""
        query = """
        MATCH (a:Article {id: $article_id})
        MATCH (i:Image) WHERE i.id IN $image_ids
        MERGE (a)-[r:CONTAINS_IMAGE]->(i)
        SET r.timestamp = datetime()
        RETURN count(r) as linked
        """
        
        with self.neo4j.session() as session:
            result = session.run(query, article_id=article_id, image_ids=image_ids)
            record = result.single()
            logger.info(f"Linked {record['linked']} images to article {article_id}")

    def link_article_to_category(self, article_id: str, category_name: str) -> None:
        """Categorize article."""
        query = """
        MATCH (a:Article {id: $article_id})
        MATCH (c:Category {name: $category_name})
        MERGE (a)-[r:IN_CATEGORY]->(c)
        SET r.timestamp = datetime()
        """
        
        with self.neo4j.session() as session:
            session.run(query, article_id=article_id, category_name=category_name)

    def add_article_tags(self, article_id: str, tags: List[str]) -> None:
        """Add tags to article."""
        query = """
        MATCH (a:Article {id: $article_id})
        UNWIND $tags as tag_name
        MERGE (t:Tag {name: tag_name})
        MERGE (a)-[r:TAGGED_WITH]->(t)
        SET r.timestamp = datetime()
        """
        
        with self.neo4j.session() as session:
            session.run(query, article_id=article_id, tags=tags)

    def link_article_to_task(self, article_id: str, task_id: str) -> None:
        """Link article to the task that generated it."""
        query = """
        MATCH (a:Article {id: $article_id})
        MATCH (t:Task {task_id: $task_id})
        MERGE (t)-[r:GENERATED_CONTENT]->(a)
        SET r.timestamp = datetime()
        """
        
        with self.neo4j.session() as session:
            session.run(query, article_id=article_id, task_id=task_id)

    def get_article_analytics(self, article_id: str) -> Dict[str, Any]:
        """Get comprehensive analytics for an article."""
        query = """
        MATCH (a:Article {id: $article_id})
        OPTIONAL MATCH (a)-[:CONTAINS_IMAGE]->(i:Image)
        OPTIONAL MATCH (a)-[:IN_CATEGORY]->(c:Category)
        OPTIONAL MATCH (a)-[:TAGGED_WITH]->(t:Tag)
        OPTIONAL MATCH (task:Task)-[:GENERATED_CONTENT]->(a)
        OPTIONAL MATCH (agent:Agent)-[:CREATED]->(a)
        
        RETURN 
            a.title as title,
            a.views as views,
            a.shares as shares,
            a.word_count as word_count,
            count(DISTINCT i) as image_count,
            c.name as category,
            collect(DISTINCT t.name) as tags,
            task.title as source_task,
            agent.name as created_by
        """
        
        with self.neo4j.session() as session:
            result = session.run(query, article_id=article_id)
            record = result.single()
            return dict(record) if record else {}

    def get_content_performance(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get top performing content."""
        query = """
        MATCH (a:Article)
        WHERE a.published_date IS NOT NULL
        RETURN 
            a.id as article_id,
            a.title as title,
            a.views as views,
            a.shares as shares,
            a.published_date as published_date,
            (a.views + a.shares * 5) as engagement_score
        ORDER BY engagement_score DESC
        LIMIT $limit
        """
        
        with self.neo4j.session() as session:
            result = session.run(query, limit=limit)
            return [dict(record) for record in result]

    def get_image_usage(self) -> List[Dict[str, Any]]:
        """Find how images are used across content."""
        query = """
        MATCH (i:Image)
        OPTIONAL MATCH (a:Article)-[:CONTAINS_IMAGE]->(i)
        RETURN 
            i.url as image_url,
            i.alt_text as alt_text,
            count(a) as used_in_articles,
            collect(a.title) as article_titles
        ORDER BY used_in_articles DESC
        """
        
        with self.neo4j.session() as session:
            result = session.run(query)
            return [dict(record) for record in result]

    def get_category_distribution(self) -> List[Dict[str, Any]]:
        """Get content distribution across categories."""
        query = """
        MATCH (c:Category)
        OPTIONAL MATCH (a:Article)-[:IN_CATEGORY]->(c)
        RETURN 
            c.name as category,
            count(a) as article_count,
            avg(a.views) as avg_views,
            sum(a.shares) as total_shares
        ORDER BY article_count DESC
        """
        
        with self.neo4j.session() as session:
            result = session.run(query)
            return [dict(record) for record in result]
