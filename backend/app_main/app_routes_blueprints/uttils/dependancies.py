from app_main.app_imports import AsyncSession, create_async_engine, db_url, AsyncGenerator, Any, Annotated, Depends, datetime
from app_main.app_global_helpers.app_logging import logger

# ! Create an asynchronous engine
engine = create_async_engine(db_url, future=True)


# ! Dependency to get the database session
async def get_db() -> AsyncGenerator[AsyncSession, Any]:
	async with AsyncSession(engine) as session:
		try:
			yield session
		except Exception as e:
			await session.rollback()
			logger.error(e)
		finally:
			await session.close()

def get_current_datetime():
	return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
dependency_db = Annotated[AsyncSession, Depends(get_db)]
dependency_time_now = Annotated[str, Depends(get_current_datetime)]