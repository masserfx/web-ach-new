#!/usr/bin/env python3
"""Import web content (articles, images, pages) into Neo4j."""

import argparse
import logging
import sys
from datetime import datetime
import uuid

from config import settings
from neo4j_db import init_neo4j
from web_content_schema import WebContentSchema

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def import_sample_content(web_schema: WebContentSchema):
    """Import sample web content for testing."""
    logger.info("Importing sample web content...")
    
    # Sample categories
    categories = [
        {"name": "Tepelná čerpadla", "slug": "tepelna-cerpadla", "description": "Články o tepelných čerpadlech", "parent_category": None},
        {"name": "Dotace", "slug": "dotace", "description": "Dotační programy", "parent_category": None},
        {"name": "Instalace", "slug": "instalace", "description": "Návody na instalaci", "parent_category": None},
        {"name": "Úspora energie", "slug": "uspora-energie", "description": "Tipy na úspory", "parent_category": None},
    ]
    
    for cat in categories:
        web_schema.create_category_node(cat)
        logger.info(f"Created category: {cat['name']}")
    
    # Sample images
    images = [
        {
            "id": str(uuid.uuid4()),
            "url": "/images/tepelne-cerpadlo-vzduch-voda.jpg",
            "alt_text": "Tepelné čerpadlo vzduch-voda",
            "title": "Moderní tepelné čerpadlo",
            "width": 1200,
            "height": 800,
            "file_size": 256000,
            "format": "jpeg",
            "uploaded_date": datetime.now().isoformat(),
            "optimized": True,
            "cdn_url": "https://cdn.ac-heating.cz/images/tc-vzduch-voda.jpg"
        },
        {
            "id": str(uuid.uuid4()),
            "url": "/images/instalace-cerpadla.jpg",
            "alt_text": "Instalace tepelného čerpadla",
            "title": "Profesionální instalace",
            "width": 1200,
            "height": 800,
            "file_size": 198000,
            "format": "jpeg",
            "uploaded_date": datetime.now().isoformat(),
            "optimized": True,
            "cdn_url": "https://cdn.ac-heating.cz/images/instalace.jpg"
        },
    ]
    
    image_ids = []
    for img in images:
        web_schema.create_image_node(img)
        image_ids.append(img["id"])
        logger.info(f"Created image: {img['url']}")
    
    # Sample articles
    articles = [
        {
            "id": str(uuid.uuid4()),
            "title": "Jak vybrat správné tepelné čerpadlo pro váš dům",
            "slug": "jak-vybrat-tepelne-cerpadlo",
            "content": "Kompletní průvodce výběrem tepelného čerpadla...",
            "excerpt": "Vyberte si ideální tepelné čerpadlo podle velikosti domu a požadavků.",
            "author": "AC Heating Experts",
            "published_date": datetime.now().isoformat(),
            "status": "published",
            "word_count": 1500,
            "read_time": 7,
            "seo_title": "Jak vybrat tepelné čerpadlo - Kompletní průvodce 2024",
            "seo_description": "Zjistěte, jak vybrat správné tepelné čerpadlo pro váš dům. Porovnání typů, výkonu a úspor.",
            "views": 450,
            "shares": 23,
            "created_by": "content_writer"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Dotace na tepelná čerpadla 2024 - Kompletní přehled",
            "slug": "dotace-tepelna-cerpadla-2024",
            "content": "Aktuální dotační programy pro instalaci tepelných čerpadel...",
            "excerpt": "Získejte až 180 000 Kč na instalaci tepelného čerpadla.",
            "author": "AC Heating Experts",
            "published_date": datetime.now().isoformat(),
            "status": "published",
            "word_count": 2000,
            "read_time": 10,
            "seo_title": "Dotace na tepelná čerpadla 2024 - Až 180 000 Kč",
            "seo_description": "Kompletní přehled dotací na tepelná čerpadla. Jak požádat, podmínky, výše podpory.",
            "views": 890,
            "shares": 67,
            "created_by": "content_writer"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Instalace tepelného čerpadla krok za krokem",
            "slug": "instalace-tepelneho-cerpadla",
            "content": "Detailní návod na profesionální instalaci tepelného čerpadla...",
            "excerpt": "Profesionální instalace tepelného čerpadla během 2-3 dnů.",
            "author": "AC Heating Experts",
            "published_date": datetime.now().isoformat(),
            "status": "published",
            "word_count": 1200,
            "read_time": 6,
            "seo_title": "Instalace tepelného čerpadla - Profesionální návod",
            "seo_description": "Kompletní průvodce instalací tepelného čerpadla včetně všech kroků a doporučení.",
            "views": 320,
            "shares": 15,
            "created_by": "content_writer"
        },
    ]
    
    for article in articles:
        article_id = article["id"]
        web_schema.create_article_node(article)
        logger.info(f"Created article: {article['title']}")
        
        # Link images to first article
        if articles.index(article) == 0:
            web_schema.link_article_to_images(article_id, image_ids)
        
        # Categorize articles
        if "čerpadlo" in article["slug"]:
            web_schema.link_article_to_category(article_id, "Tepelná čerpadla")
        if "dotace" in article["slug"]:
            web_schema.link_article_to_category(article_id, "Dotace")
        if "instalace" in article["slug"]:
            web_schema.link_article_to_category(article_id, "Instalace")
        
        # Add tags
        tags = []
        if "tepelné čerpadlo" in article["title"].lower():
            tags.append("tepelná čerpadla")
        if "dotace" in article["title"].lower():
            tags.extend(["dotace", "finance", "úspora"])
        if "instalace" in article["title"].lower():
            tags.extend(["instalace", "návod"])
        
        if tags:
            web_schema.add_article_tags(article_id, tags)
    
    # Sample pages
    pages = [
        {
            "id": str(uuid.uuid4()),
            "path": "/",
            "title": "AC Heating - Tepelná čerpadla a klimatizace",
            "template": "homepage",
            "layout": "default",
            "published": True,
            "created_date": datetime.now().isoformat(),
            "meta_title": "AC Heating - Tepelná čerpadla a klimatizace pro váš dům",
            "meta_description": "Profesionální dodávka a instalace tepelných čerpadel. Dotace až 180 000 Kč.",
            "canonical_url": "https://ac-heating.cz/"
        },
        {
            "id": str(uuid.uuid4()),
            "path": "/produkty/tepelna-cerpadla",
            "title": "Tepelná čerpadla - AC Heating",
            "template": "product-category",
            "layout": "default",
            "published": True,
            "created_date": datetime.now().isoformat(),
            "meta_title": "Tepelná čerpadla - Vzduch-voda, Země-voda | AC Heating",
            "meta_description": "Široká nabídka tepelných čerpadel pro rodinné domy i bytové domy.",
            "canonical_url": "https://ac-heating.cz/produkty/tepelna-cerpadla"
        },
    ]
    
    for page in pages:
        web_schema.create_page_node(page)
        logger.info(f"Created page: {page['path']}")
    
    logger.info("Sample content import complete!")


def main(import_sample: bool = False):
    """Main function."""
    logger.info("Starting web content import")
    
    if not settings.neo4j_enabled:
        logger.error("Neo4j is not enabled in settings!")
        return False
    
    try:
        # Initialize Neo4j
        neo4j_conn = init_neo4j(
            uri=settings.neo4j_uri,
            user=settings.neo4j_user,
            password=settings.neo4j_password
        )
        
        # Initialize web content schema
        web_schema = WebContentSchema(neo4j_conn)
        web_schema.create_web_indexes()
        
        if import_sample:
            import_sample_content(web_schema)
        else:
            logger.info("Use --sample flag to import sample content")
        
        neo4j_conn.close()
        logger.info("Web content import complete!")
        return True
        
    except Exception as e:
        logger.error(f"Error during import: {e}", exc_info=True)
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import web content into Neo4j")
    parser.add_argument(
        "--sample",
        action="store_true",
        help="Import sample content for testing",
    )
    args = parser.parse_args()
    
    success = main(import_sample=args.sample)
    sys.exit(0 if success else 1)
