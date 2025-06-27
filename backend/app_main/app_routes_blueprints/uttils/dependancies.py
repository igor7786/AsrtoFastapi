from app_main.app_imports import (AsyncSession, create_async_engine, AsyncGenerator, Any, Annotated, Depends,
                                  datetime, OAuth2PasswordRequestForm, os, HTTPException, status, make_url, asyncpg,
                                  )
from app_main.app_global_helpers.app_logging import logger
from app_main.app_routes_blueprints.uttils.helpers_auth import _get_current_user
from app_main.settings.config import get_settings
# ! Change regarding DB path
db_url = get_settings().SQLITE_PATH
# ✅ Function to check DB connectivity BEFORE engine is created
# ! Dependency to get the database session
async def ensure_database_exists():
	sqlite_details = ("SQLite database not found. Run `alembic upgrade head` in /backend/app_dbs/sqlite to initialize "
	                  "it.")
	posgresql_details = ("PostgreSQL database not found. Run `alembic upgrade head` in /backend/app_dbs/postgresql "
	                     "to initialize it.")
	url_obj = make_url(db_url)
	# ✅ SQLite check
	if url_obj.drivername.startswith("sqlite"):
		path = db_url.replace("sqlite+aiosqlite:///", "")
		if not os.path.exists(path):
			logger.error(f"❌ ===> {sqlite_details}")
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail=sqlite_details
			)

	# ✅ PostgreSQL check
	elif url_obj.drivername.startswith("postgresql"):
		try:
			raw_pg_url = db_url.replace("+asyncpg", "")
			conn = await asyncpg.connect(dsn=raw_pg_url)
			await conn.close()
		except asyncpg.InvalidCatalogNameError:
			logger.error(f"❌ ===> {posgresql_details}")
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail=posgresql_details
			)
		except asyncpg.InvalidPasswordError:
			logger.error("❌ PostgreSQL authentication failed.")
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail="Invalid PostgreSQL credentials. Check username/password in your config."
			)
		except Exception as e:
			logger.error(f"❌ Unexpected PostgreSQL error: {e}")
			raise HTTPException(
				status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
				detail="Could not connect to PostgreSQL. Check connection settings."
			)


async def init_engine():
	await ensure_database_exists()
	return create_async_engine(db_url, future=True)


async def get_db() -> AsyncGenerator[AsyncSession, Any]:
	engine = await init_engine()
	async with AsyncSession(engine) as session:
		try:
			yield session
		except Exception as e:
			await session.rollback()
			logger.error(e)
			raise
		finally:
			await session.close()


def get_current_datetime():
	return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


dependency_db = Annotated[AsyncSession, Depends(get_db)]
dependency_time_now = Annotated[str, Depends(get_current_datetime)]
dependency_form_data = Annotated[OAuth2PasswordRequestForm, Depends()]
current_user = Annotated[dict, Depends(_get_current_user)]
