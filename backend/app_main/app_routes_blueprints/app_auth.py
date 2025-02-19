from typing import Annotated
from fastapi import Depends

from app_main.app_imports import (APIRouter, select, HTTPException, JSONResponse, jsonable_encoder, IntegrityError,
                                  timedelta)
from app_main.app_models.models_schema_validation import User
from app_main.app_models.models import Users
from app_main.app_routes_blueprints.uttils.dependancies import (dependency_db, dependency_time_now,
                                                                dependency_form_data)
from app_main.app_global_helpers.app_logging import logger
from app_main.app_routes_blueprints.uttils.helpers_auth import (_auth_user, bcrypt_context, _create_jwt_token)

# from app_main.app_models.models import Book
# dependency_user = Annotated[dict, Depends(_get_current_user)]
PREFIX = "/v1/auth"
router = APIRouter(prefix=PREFIX, tags=["Auth-User"])
logger.warning(f'route endpoint-> {PREFIX}')


@router.get("/", status_code=200)
async def get_all_users(db: dependency_db, time_now: dependency_time_now) -> JSONResponse:
	result = await db.exec(select(Users))
	all_users = result.all()
	return JSONResponse(
		content={'allUsers': jsonable_encoder(all_users), "dateCreated": f"{time_now}"},
		status_code=200,
		headers={"Location": f"{PREFIX}/auth"},
	)


@router.post("/create-user", status_code=201)
async def create_user(db: dependency_db, time_now: dependency_time_now, user: User) -> JSONResponse:
	try:
		cr_user = Users(**user.model_dump(exclude_unset=True))
		cr_user.hashed_password = bcrypt_context.hash(cr_user.hashed_password)
		db.add(cr_user)
		await db.commit()
		await db.refresh(cr_user)
		return JSONResponse(
			content={'auth': "success", "dateCreated": f"{time_now}", "user": jsonable_encoder(cr_user)},
			status_code=201,
			headers={"Location": f"{PREFIX}"},
		)
	except IntegrityError as e:
		logger.error(e)
		raise HTTPException(
			status_code=422, detail="User already exist."
		) from e

	except Exception as e:
		raise HTTPException(
			status_code=500, detail=f"Internal Server Error: {str(e)}"
		) from e


@router.post("/token", status_code=201)
async def create_token(db: dependency_db, form_data: dependency_form_data):
	if user := await _auth_user(db, form_data.username, form_data.password):
		jwt_token = _create_jwt_token(user.user_name, user.id, timedelta(minutes=30))
		return JSONResponse(
			content={"access_token": jwt_token, "token_type": "bearer"}, status_code=201,
			headers={"Location": f"{PREFIX}/token"}
		)
	else:
		raise HTTPException(status_code=401, detail="Failed to create user")
