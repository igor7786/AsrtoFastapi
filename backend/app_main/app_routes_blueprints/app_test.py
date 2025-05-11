from fastapi import Request
from app_main.app_imports import APIRouter
from app_main.app_global_helpers.app_logging import logger

PREFIX = "/api/v1/test"

router = APIRouter(prefix=PREFIX, tags=["Tests"])
logger.warning(f'route endpoint-> {PREFIX}')


@router.get("/", status_code=200)
async def test(request: Request):
	http_request = request.get('http_version') # Convert MultiDict to a standard dictionary
	logger.warning(http_request)
	return {
		"http": http_request,
	}