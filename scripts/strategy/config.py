"""Configuration management for Strategy Orchestrator."""

import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Anthropic API
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-5-20250929"
    anthropic_max_tokens: int = 4096

    # Database
    db_host: str = "localhost"
    db_port: int = 54322
    db_name: str = "postgres"
    db_user: str = "postgres"
    db_password: str = ""
    db_ssl: bool = False

    # Application
    project_root: Path = Path(__file__).parent.parent.parent
    strategy_doc_path: Path = Path(__file__).parent.parent.parent / "vize_mise_swot_cile.md"
    log_level: str = "INFO"
    dry_run: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @property
    def db_url(self) -> str:
        """Generate database connection URL."""
        sslmode = "require" if self.db_ssl else "disable"
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}?sslmode={sslmode}"


# Load settings
settings = Settings()
