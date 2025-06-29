from app_main.app_imports import (AsyncSession, create_async_engine, AsyncGenerator, Any, Annotated, Depends,
                                  datetime, OAuth2PasswordRequestForm, os, HTTPException, status, make_url, asyncpg,
                                  AsyncEngine, sessionmaker, Optional
                                  )
from app_main.app_global_helpers.app_logging import logger
from app_main.app_routes_blueprints.uttils.helpers_auth import _get_current_user
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
		Checks if the database exists and is accessible.
		- For SQLite, it ensures the file exists.
		- For PostgreSQL, it tries to establish a connection.
		"""
		url_obj = make_url(self.db_url)

		if url_obj.drivername.startswith("sqlite"):
			path = self.db_url.replace("sqlite+aiosqlite:///", "")
			if not os.path.exists(path):
				msg = "SQLite DB not found. Run `alembic upgrade head`."
				logger.error(msg)
				raise HTTPException(status_code=500, detail=msg)

		elif url_obj.drivername.startswith("postgresql"):
			try:
				# Remove +psycopg for raw DSN compatibility
				raw_pg_url = self.db_url.replace("+psycopg", "")
				conn = await asyncpg.connect(dsn=raw_pg_url)
				await conn.close()
			except asyncpg.InvalidCatalogNameError:
				# Database doesn't exist
				raise HTTPException(status_code=500, detail="PostgreSQL DB not found.")
			except asyncpg.InvalidPasswordError:
				# Wrong credentials
				raise HTTPException(status_code=500, detail="Invalid PostgreSQL credentials.")
			except Exception as e:
				# Other connection errors
				raise HTTPException(status_code=500, detail=f"DB connection error: {e}")

	async def init(self):
		"""
		Initializes the database engine and sessionmaker.
		Should be called once at app startup.
		"""
		await self.ensure_database_exists()
		self._engine = create_async_engine(
			self.db_url,
			echo=True,  # Echo SQL statements for debugging
			future=True  # Enable 2.0 API behavior
		)
		self._sessionmaker = sessionmaker(
			bind=self._engine,
			class_=AsyncSession,
			expire_on_commit=False
		)

	async def get_session(self) -> AsyncGenerator[AsyncSession, Any]:
		"""
		Yields an async database session from the sessionmaker.
		Handles rollback and closing of session on errors.
		Used as a dependency in FastAPI routes.
		"""
		if not self._sessionmaker:
			await self.init()

		async with self._sessionmaker() as session:
			try:
				yield session
			except Exception as e:
				await session.rollback()
				logger.error(e)
				raise
			finally:
				await session.close()

	async def close(self):
		"""
		Gracefully disposes the engine (closes all connections).
		Should be called during FastAPI shutdown/lifespan cleanup.
		"""
		if self._engine:
			await self._engine.dispose()


def get_current_datetime():
	return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


get_db = DatabaseManager(settings.POSTGRES_SQL_PATH if settings.ENV.startswith('prod') else settings.SQLITE_PATH)
dependency_db = Annotated[AsyncSession, Depends(get_db.get_session)]
dependency_time_now = Annotated[str, Depends(get_current_datetime)]
dependency_form_data = Annotated[OAuth2PasswordRequestForm, Depends()]
current_user = Annotated[dict, Depends(_get_current_user)]
