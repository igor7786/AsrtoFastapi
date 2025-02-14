from app_main.app_imports import APIRouter, Depends, datetime, AsyncSession
from app_main.app_models.models import Tasks, User
from app_main.app_routes_blueprints.uttils.dependancies import get_db

router = APIRouter(prefix="/v1/user", tags=["user"])


@router.post("/")
async def greet(request: User, db: AsyncSession = Depends(get_db)) -> dict:
	task_add = Tasks(**request.model_dump())
	db.add(task_add)
	await db.commit()
	await db.refresh(task_add)

	date_time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	return {"dateNow": f"{date_time_now}", "task": task_add.task}


@router.get("/")
async def async_root(db:AsyncSession = Depends(get_db)) -> dict:
	task_add = Tasks(
		user_email="email@gmail.com",
		user_name="name",
		task="task"
	)
	db.add(task_add)
	await db.commit()
	await db.refresh(task_add)
	date_time_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	return {"timeNow": f"{date_time_now}"}
