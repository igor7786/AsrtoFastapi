from app_main.app_imports import AsyncSession, create_async_engine, db_url
from app_main.app_dependancies_helpers_global_vars.app_logging import logger
# ! Create an asynchronous engine
engine = create_async_engine(db_url, future=True)


# ! Dependency to get the database session
async def get_db() -> AsyncSession:
	async with AsyncSession(engine) as session:
		try:
			yield session
		except Exception as e:
			await session.rollback()
			logger.error(e)
			raise e
