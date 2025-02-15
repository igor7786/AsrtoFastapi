from app_main.app_imports import (APIRouter, select, HTTPException, JSONResponse, jsonable_encoder, IntegrityError,
                                  CryptContext)
from app_main.app_models.models_schema_validation import User
from app_main.app_models.models import Users
from app_main.app_routes_blueprints.uttils.dependancies import dependency_db, dependency_time_now
from app_main.app_global_helpers.app_logging import logger
# from app_main.app_models.models import Book
PREFIX = "/v1/auth"
router = APIRouter(prefix=PREFIX, tags=["Auth-User"])
logger.warning(f'route endpoint-> {PREFIX}')
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/auth", status_code=200)
async def get_all_users(db: dependency_db, time_now: dependency_time_now) -> JSONResponse:
	result = await db.exec(select(Users))
	all_users = result.all()
	return JSONResponse(
		content={'allUsers': jsonable_encoder(all_users), "dateCreated": f"{time_now}"},
		status_code=200,
		headers={"Location": f"{PREFIX}/auth"},
	)


@router.post("/auth", status_code=201)
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
			headers={"Location": f"{PREFIX}/books"},
		)
	except IntegrityError:
		raise HTTPException(
			status_code=422, detail="User already exist."
		)

	except Exception as e:
		raise HTTPException(
			status_code=500, detail=f"Internal Server Error: {str(e)}"
		)
