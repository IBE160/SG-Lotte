from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    # Add other settings as needed

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
