from app_main.imports import BaseSettings, SettingsConfigDict, lru_cache, Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
	ENV: str
	ENV_DOCKER: str
	SECRET_KEY: str
	FAST_API_HOST: str
	FAST_API_PORT: int
	SQLITE_MIGRATE_URL: str
	SQLITE_URL: str
	POSTGRES_URL: str
	POSTGRES_URL_DOCKER: str
	POSTGRES_URL_DOCKER_BETWEEN: str
	REDIS_URL_DOCKER_BETWEEN: str
	REDIS_URL_DOCKER: str
	API_AI_KEY_GEMMINI: str
	API_AI_MODEL_GEMMINI: str
	API_AI_KEY_QWEN: str
	API_AI_MODEL_QWEN: str
	API_AI_BASE_QWEN: str

	model_config = SettingsConfigDict(
		env_file=f"{BASE_DIR}/.env", env_file_encoding="utf-8", extra="ignore", case_sensitive=True
		)


@lru_cache
def get_settings():
	return Settings()


settings = get_settings()
