from app_main.app_imports import (APIRouter, select, Query, Body, FastApiPath, Response, HTTPException, JSONResponse,
                                  jsonable_encoder)
from app_main.app_models.models import User
from app_main.app_routes_blueprints.uttils.dependancies import dependency_db, dependency_time_now
# from app_main.app_models.models import Book
from app_main.app_global_helpers.app_logging import logger

PREFIX = "/v1/auth"

router = APIRouter(prefix=PREFIX, tags=["Auth-User"])
logger.warning(f'route endpoint-> {PREFIX}')


@router.get("/auth", status_code=200)
async def get_all_books(db: dependency_db, time_now: dependency_time_now) -> JSONResponse:
	return JSONResponse(
		content={'auth': "success", "dateCreated": f"{time_now}"},
		status_code=200,
		headers={"Location": f"{PREFIX}/books"},
	)
@router.post("/auth", status_code=201)
async def get_all_books(db: dependency_db, time_now: dependency_time_now, user: User) -> JSONResponse:
	logger.info(user)
	return JSONResponse(
		content={'auth': "success", "dateCreated": f"{time_now}", "user": jsonable_encoder(user)},
		status_code=201,
		headers={"Location": f"{PREFIX}/books"},
	)