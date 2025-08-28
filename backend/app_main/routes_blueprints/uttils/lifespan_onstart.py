from app_main.imports import asynccontextmanager, FastAPI, AsyncClient, Timeout
from app_main import get_db
from app_main.global_helpers.app_logging import logger
from app_main.routes_blueprints.uttils.app_redis import redis_manager

timeout = Timeout(30.0, connect=5.0)





@asynccontextmanager
async def lifespan(app: FastAPI):
	# Assuming logger, AsyncClient, timeout, get_db, redis_url_env are defined elsewhere
	logger.info("Lifespan started with HTTP/2 client and Database connection")
	app.http_client = AsyncClient(http2=True, timeout=timeout)
	await redis_manager.init()
	app.state.redis_manager = redis_manager
	await get_db.init()

	yield  # app is running
	await app.http_client.aclose()
	await get_db.close()
	await redis_manager.close()
	logger.info("Lifespan shutdown completed")
