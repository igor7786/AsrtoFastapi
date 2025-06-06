from app_main.app_imports import (AsyncSession, create_async_engine, db_url, AsyncGenerator, Any, Annotated, Depends,
                                  datetime, OAuth2PasswordRequestForm)
from app_main.app_global_helpers.app_logging import logger
from app_main.app_routes_blueprints.uttils.helpers_auth import _get_current_user

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
			raise e
		finally:
			await session.close()

def get_current_datetime():
	return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
dependency_db = Annotated[AsyncSession, Depends(get_db)]
dependency_time_now = Annotated[str, Depends(get_current_datetime)]
dependency_form_data = Annotated[OAuth2PasswordRequestForm, Depends()]
current_user = Annotated[dict, Depends(_get_current_user)]
