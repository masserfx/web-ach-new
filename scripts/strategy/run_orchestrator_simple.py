#!/usr/bin/env python3
"""Simplified orchestrator without learning system."""

import logging
import time
from config import settings
from db import db
from orchestrator import StrategyOrchestrator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

try:
    db.connect()
    orchestrator = StrategyOrchestrator()
    
    logger.info("Simplified Orchestrator started - continuous mode (30s interval)")
    
    while True:
        try:
            logger.info("=" * 60)
            logger.info("Starting orchestration cycle")
            
            tasks = orchestrator.get_next_tasks(limit=5)
            logger.info(f"Found {len(tasks)} tasks to process")
            
            succeeded = 0
            failed = 0
            
            for task in tasks:
                try:
                    if not orchestrator.can_execute_task(task):
                        logger.warning(f"Skipping task {task['id']}: no agent assigned")
                        failed += 1
                        continue
                    
                    logger.info(f"Executing: {task['title']}")
                    agent_name = task.get('agent_name')
                    agent = orchestrator.agents.get(agent_name)
                    
                    if agent:
                        result = agent.execute(task)
                        logger.info(f"✅ Task completed: {task['title']}")
                        succeeded += 1
                    else:
                        logger.error(f"Agent not found: {agent_name}")
                        failed += 1
                        
                except Exception as e:
                    logger.error(f"Error executing task: {e}")
                    failed += 1
            
            logger.info(f"Batch complete: {succeeded} succeeded, {failed} failed")
            logger.info("Waiting 30 seconds until next cycle...")
            time.sleep(30)
            
        except Exception as e:
            logger.error(f"Orchestration error: {e}")
            time.sleep(30)
            
except Exception as e:
    logger.error(f"Fatal error: {e}")
    exit(1)
