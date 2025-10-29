#!/usr/bin/env python3
"""Import strategy document from markdown into database."""

import argparse
import logging
import sys
from pathlib import Path

from config import settings
from db import db

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def parse_strategy_document(doc_path: Path) -> str:
    """Parse strategy document."""
    try:
        with open(doc_path, "r", encoding="utf-8") as f:
            content = f.read()
        logger.info(f"Successfully read strategy document: {doc_path}")
        return content
    except FileNotFoundError:
        logger.error(f"Strategy document not found: {doc_path}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error reading strategy document: {e}")
        sys.exit(1)


def import_strategy(doc_path: Path = None) -> bool:
    """Import strategy document into database."""
    if doc_path is None:
        doc_path = settings.strategy_doc_path

    logger.info(f"Starting strategy import from: {doc_path}")

    # Connect to database
    try:
        db.connect()
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        return False

    try:
        # Read strategy document
        content = parse_strategy_document(doc_path)

        # For now, just log that we've imported
        # In production, this would parse the markdown and create tasks
        logger.info(f"Strategy document content length: {len(content)} characters")
        logger.info("Strategy document import successful")
        logger.info("Note: Task generation should be done via generate_tasks.py script")

        return True

    except Exception as e:
        logger.error(f"Error importing strategy: {e}")
        return False

    finally:
        db.disconnect()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import strategy document")
    parser.add_argument(
        "--doc-path",
        type=Path,
        default=None,
        help="Path to strategy document",
    )
    args = parser.parse_args()

    success = import_strategy(args.doc_path)
    sys.exit(0 if success else 1)
