from redis.asyncio import Redis

import json
from typing import Optional, Literal
import uuid
from app_main.global_helpers.app_logging import logger
from app_main.settings.config import settings
from app_main.imports import HTTPException


# --- Normalize UUID session format ---


def normalize_session_id(session_id: str) -> str:
	"""Normalize session ID to standard UUID string format if possible."""
	try:
		return str(uuid.UUID(session_id))
	except ValueError:
		return session_id


class RedisManager:
	def __init__(self, redis_url: str):
		self.redis_url = redis_url
		self.redis: Optional[Redis] = None
		self._init_failed = False  # track failed init

	async def init(self):
		try:
			self.redis = Redis.from_url(
				self.redis_url,
				encoding="utf8",
				decode_responses=True,
				socket_connect_timeout=1.0,
			)
			await self.redis.ping()
			self._init_failed = False
			logger.info(f"✅ Connected to Redis at {self.redis_url}")
		except ConnectionError as e:
			self.redis = None
			self._init_failed = True
			logger.warning(f"⚠ Redis connection failed: {e}. Redis will be disabled.")
		except Exception as e:
			self.redis = None
			self._init_failed = True
			logger.error(f"❌ Unexpected Redis init error: {e}")

	async def close(self):
		if self.redis:
			await self.redis.close()
			self.redis = None
			logger.info("Redis connection closed")

	async def _ensure_ready(self) -> bool:
		if self.redis is not None:
			return True
		if self._init_failed:
			logger.info("🔁 Attempting to reinitialize Redis...")
			await self.init()
		return self.redis is not None

	async def set_token(self, session_id: str, token_data: str, expire: int = 3600):
		norm_id = normalize_session_id(session_id)
		if not await self._ensure_ready():
			logger.warning("Redis unavailable. Skipping set_token.")
			return

		try:
			json.loads(token_data)  # Validate input
			await self.redis.set(norm_id, token_data, ex=expire)
			logger.info(f"Stored token for session: {norm_id}, expires in {expire}s")
		except json.JSONDecodeError as e:
			logger.error(f"Invalid JSON token data for session {norm_id}: {e}")
		except Exception as e:
			logger.error(f"Error setting Redis token for {norm_id}: {e}")

	async def get_token(self, session_id: str) -> Optional[str]:
		norm_id = normalize_session_id(session_id)
		if not await self._ensure_ready():
			logger.warning("Redis unavailable. Skipping get_token.")
			return None

		try:
			result = await self.redis.get(norm_id)
			logger.info(f"Got token for session {norm_id}: {result}")
			return result
		except Exception as e:
			logger.error(f"Error getting Redis token for {norm_id}: {e}")
			return None


def get_db_env_var_redis():
	if settings.ENV.startswith('prod') and settings.ENV_DOCKER.startswith('between'):
		logger.error(f"Using docker path {settings.REDIS_URL_DOCKER_BETWEEN}")
		return settings.REDIS_URL_DOCKER_BETWEEN
	if settings.ENV.startswith('prod'):
		return settings.REDIS_URL_DOCKER
	elif settings.ENV.startswith('dev'):
		return settings.REDIS_URL_DOCKER
	return None


redis_url = get_db_env_var_redis()
redis_manager = RedisManager(redis_url)
