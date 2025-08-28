from app_main.imports import (AsyncSession, create_async_engine, AsyncGenerator, Any, Annotated, Depends,
                              datetime, OAuth2PasswordRequestForm, os, HTTPException, status, make_url, asyncpg,
                              AsyncEngine, sessionmaker, Optional
                              )
from app_main.global_helpers.app_logging import logger
from app_main.routes_blueprints.uttils.helpers_auth import _get_current_user
from app_main.settings.config import settings


class DatabaseManager:
	def __init__(self, db_url: str):
		"""
		Initialize the DatabaseManager with a database URL.
		"""
		self.db_url = db_url
		self._engine: Optional[AsyncEngine] = None  # SQLAlchemy async engine
		self._sessionmaker: Optional[sessionmaker] = None  # SQLAlchemy session factory

	async def ensure_database_exists(self):
		"""
		Checks if the database exists and is accessible:
		- For SQLite: ensures file exists
		- For PostgreSQL: pings DB using asyncpg
		"""
		url_obj = make_url(self.db_url)

		if url_obj.drivername.startswith("sqlite"):
			path = self.db_url.replace("sqlite+aiosqlite:///", "")
			if not os.path.exists(path):
				msg = f"SQLite DB not found at path: {path}. Run `alembic upgrade head`."
				logger.error(msg)
				raise RuntimeError(msg)

		elif url_obj.drivername.startswith("postgresql"):
			try:
				raw_pg_url = self.db_url.replace("+psycopg", "")
				conn = await asyncpg.connect(dsn=raw_pg_url)
				await conn.close()
				logger.info("✅ PostgreSQL connection check passed")
			except asyncpg.InvalidCatalogNameError:
				raise RuntimeError("❌ PostgreSQL DB not found.")
			except asyncpg.InvalidPasswordError:
				raise RuntimeError("❌ Invalid PostgreSQL credentials.")
			except Exception as e:
				raise RuntimeError(f"❌ PostgreSQL connection error: {e}")

	async def init(self):
		"""
		Initializes the database engine and sessionmaker.
		Should be called once at app startup.
		"""
		try:
			await self.ensure_database_exists()

			self._engine = create_async_engine(
				self.db_url,
				echo=True,  # Set to False in production
				future=True
			)
			self._sessionmaker = sessionmaker(
				bind=self._engine,
				class_=AsyncSession,
				expire_on_commit=False
			)
			logger.info(f"✅ Database engine initialized for {self.db_url}")
		except Exception as e:
			logger.error(f"❌ Database initialization failed: {e}")
			self._engine = None
			self._sessionmaker = None
	async def get_session(self) -> AsyncGenerator[AsyncSession, Any]:
		"""
		Yields an async database session from the sessionmaker.
		Handles rollback and closing of session on errors.
		Used as a dependency in FastAPI routes.
		"""
		if not self._sessionmaker:
			logger.warning("⚠ DB sessionmaker not initialized. Attempting re-init...")
			await self.init()

		if not self._sessionmaker:
			logger.critical("❌ Database unavailable: sessionmaker is None")
			raise RuntimeError("Database not available")

		async with self._sessionmaker() as session:
			try:
				yield session
			except Exception as e:
				await session.rollback()
				logger.error(f"❌ DB session rollback due to error: {e}")
				raise
			finally:
				await session.close()

	async def close(self):
		"""
		Gracefully disposes the engine during app shutdown.
		"""
		if self._engine:
			await self._engine.dispose()
			logger.info("✅ Database engine disposed")

def get_db_env_var_db():
	if settings.ENV.startswith('prod') and settings.ENV_DOCKER.startswith('between'):
		logger.error(f"Using docker path {settings.POSTGRES_SQL_PATH_DOCKER_BETWEEN}")
		return settings.POSTGRES_SQL_PATH_DOCKER_BETWEEN
	if settings.ENV.startswith('prod'):
		return settings.POSTGRES_URL_DOCKER
	elif settings.ENV.startswith('dev'):
		return settings.SQLITE_URL
	return None


db_var = get_db_env_var_db()
get_db = DatabaseManager(db_url=db_var)

def get_current_datetime():
	return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
dependency_db = Annotated[AsyncSession, Depends(get_db.get_session)]
dependency_time_now = Annotated[str, Depends(get_current_datetime)]
dependency_form_data = Annotated[OAuth2PasswordRequestForm, Depends()]
current_user = Annotated[dict, Depends(_get_current_user)]
