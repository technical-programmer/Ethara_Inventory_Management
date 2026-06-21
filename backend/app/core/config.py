import os
from functools import lru_cache


class Settings:
    def __init__(self) -> None:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise RuntimeError(
                "DATABASE_URL environment variable is not set. "
                "Copy .env.example to .env and fill in your local values."
            )
        self.database_url: str = database_url
        self.cors_origins: list[str] = os.getenv(
            "CORS_ORIGINS", "http://localhost:5173"
        ).split(",")
        self.app_name: str = "Inventory & Order Management API"
        self.app_version: str = "1.0.0"


@lru_cache
def get_settings() -> Settings:
    return Settings()