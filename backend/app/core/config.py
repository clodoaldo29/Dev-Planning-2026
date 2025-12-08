from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    api_prefix: str = "/api"
    auth_prefix: str = "/auth"
    spreadsheet_id: str = Field("SPREADSHEET_ID", env="SPREADSHEET_ID")
    sheet_name: str = "Planejamento_2026"
    admin_username: str = Field("admin", env="ADMIN_USER")
    admin_password: str = Field("changeme", env="ADMIN_PASSWORD")
    secret_key: str = Field("super-secret-key", env="SECRET_KEY")
    token_expire_minutes: int = 60
    cors_origins: list[str] = Field(default_factory=lambda: ["*"])
    google_credentials_path: str = Field(
        "./credentials.json",
        env="GOOGLE_APPLICATION_CREDENTIALS",
        description="Path to the Google service account credentials JSON file.",
    )

    class Config:
        env_file = ".env"


def get_settings() -> Settings:
    return Settings()
