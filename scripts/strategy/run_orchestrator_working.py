#!/usr/bin/env python3
"""Run the Strategy Orchestrator - working version."""

import logging
import sys
import time
from config import settings
from db import db
from orchestrator import StrategyOrchestrator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

def main():
    logger.info("Starting Strategy Orchestrator (continuous mode)")
    logger.info(f"Configuration: limit=5, continuous=True, interval=30s")
    
    try:
        db.connect()
        orchestrator = StrategyOrchestrator()
        
        while True:
            try:
                logger.info("=" * 60)
                logger.info("Starting orchestration cycle")
                
                # Use execute_batch which we know works
                result = orchestrator.execute_batch(limit=5)
                
                logger.info(f"Batch complete: {result['succeeded']} succeeded, {result['failed']} failed")
                logger.info("Waiting 30 seconds before next cycle...")
                time.sleep(30)
                
            except Exception as e:
                logger.error(f"Error during orchestration: {e}", exc_info=False)
                logger.info("Waiting 30 seconds before retry...")
                time.sleep(30)
                
    except Exception as e:
        logger.error(f"Fatal error: {e}")
        return False
    finally:
        try:
            db.disconnect()
        except:
            pass
    
    return True

if __name__ == "__main__":
    main()
