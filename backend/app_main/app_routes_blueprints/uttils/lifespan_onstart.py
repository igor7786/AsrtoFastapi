from app_main.app_imports import asynccontextmanager, FastAPI, AsyncClient, Timeout
from app_main import get_db
from app_main.app_global_helpers.app_logging import logger

timeout = Timeout(30.0, connect=5.0)


@asynccontextmanager
async def lifespan(app: FastAPI):
	logger.info("Lifespan started with HTTP/2 client and Database connection")
	# Initialize a shared HTTP/2 client for the application
	app.http_client = AsyncClient(http2=True, timeout=timeout)
	await get_db.init()
	yield  # Application is running
	await app.http_client.aclose()
	await get_db.close()
	logger.info("Lifespan finished with HTTP/2 client and Database connection")
