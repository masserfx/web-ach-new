"""Data models for Strategy Orchestrator."""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional, List
from enum import Enum


class TaskStatus(str, Enum):
    """Task status enumeration."""

    BACKLOG = "backlog"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    APPROVED = "approved"
    REJECTED = "rejected"
    DONE = "done"
    BLOCKED = "blocked"


class TaskCategory(str, Enum):
    """Task category enumeration."""

    CONTENT = "content"
    SEO = "seo"
    PRODUCT = "product"
    MARKETING = "marketing"
    TECHNICAL = "technical"
    UX = "ux"
    BUSINESS = "business"


class ExecutionType(str, Enum):
    """Type of execution."""

    GENERATION = "generation"
    REVISION = "revision"
    OPTIMIZATION = "optimization"
    VALIDATION = "validation"


class ExecutionStatus(str, Enum):
    """Execution status enumeration."""

    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class AgentSkills:
    """Agent skills and capabilities."""

    id: str
    agent_name: str
    agent_type: str
    display_name: str
    description: Optional[str]
    skills: List[str]
    supported_content_types: Optional[List[str]]
    system_prompt: str
    model: str
    max_tokens: int
    temperature: float
    execution_config: Optional[dict]
    tasks_completed: int
    avg_quality_score: Optional[float]
    success_rate: Optional[float]
    active: bool
    created_at: datetime
    updated_at: datetime


@dataclass
class StrategyTask:
    """Strategy task definition."""

    id: str
    title: str
    description: Optional[str]
    category: TaskCategory
    priority: int
    strategy_section: Optional[str]
    strategy_document: str
    assigned_to: Optional[str]
    agent_name: Optional[str]
    agent_type: Optional[str]
    prompt_template: Optional[str]
    expected_output: Optional[dict]
    dependencies: Optional[List[str]]
    status: TaskStatus
    progress: int
    requires_approval: bool
    approval_status: Optional[str]
    approved_by: Optional[str]
    approved_at: Optional[datetime]
    rejection_reason: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    estimated_hours: Optional[float]
    actual_hours: Optional[float]
    output_content_id: Optional[str]
    output_data: Optional[dict]
    quality_score: Optional[float]
    tags: Optional[List[str]]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime


@dataclass
class ExecutionLog:
    """Execution log entry."""

    id: str
    task_id: str
    agent_name: Optional[str]
    execution_type: ExecutionType
    trigger_source: str
    started_at: datetime
    completed_at: Optional[datetime]
    duration_ms: Optional[int]
    input_prompt: Optional[str]
    input_data: Optional[dict]
    output_data: Optional[dict]
    model_used: str
    tokens_used: Optional[int]
    api_cost: Optional[float]
    status: ExecutionStatus
    error_message: Optional[str]
    error_details: Optional[dict]
    output_quality_score: Optional[float]
    validation_errors: Optional[List[str]]
    created_at: datetime


@dataclass
class TaskApproval:
    """Task approval workflow."""

    id: str
    task_id: str
    version: int
    content_snapshot: dict
    changes_made: Optional[str]
    submitted_by: str
    submitted_at: datetime
    reviewer_email: Optional[str]
    review_status: str
    reviewed_at: Optional[datetime]
    reviewer_notes: Optional[str]
    suggested_changes: Optional[dict]
    decision: Optional[str]
    decision_reason: Optional[str]
    created_at: datetime
