from typing import Any

from pydantic import BaseSettings, Field, validator


class Settings(BaseSettings):
    api_prefix: str = "/api"
    auth_prefix: str = "/auth"
    spreadsheet_id: str = Field("SPREADSHEET_ID", env="SPREADSHEET_ID")
    sheet_name: str = "Planejamento_2026"
    admin_username: str = Field("admin", env="ADMIN_USER")
    admin_password: str = Field("changeme", env="ADMIN_PASSWORD")
    secret_key: str = Field("super-secret-key", env="SECRET_KEY")
    token_expire_minutes: int = 60
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"]
    )
    google_credentials_path: str = Field(
        "./credentials.json",
        env="GOOGLE_APPLICATION_CREDENTIALS",
        description="Path to the Google service account credentials JSON file.",
    )

    class Config:
        env_file = ".env"

    @validator("cors_origins", pre=True)
    def split_cors_origins(cls, value: Any) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


def get_settings() -> Settings:
    return Settings()
