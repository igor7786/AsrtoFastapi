from app_main.app_imports import FastAPI, CORSMiddleware, ValidationError, Request, JSONResponse

from app_main.app_models.models import Tasks
from app_main.app_routes_blueprints import app_user, app_ai
from app_main.app_middleware.app_csrf_middleware import CSRFMiddleware

# from rich import print

app = FastAPI()
# Add the CSRF middleware
# app.add_middleware(CSRFMiddleware)
CORSMiddleware(app, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
	return JSONResponse(
		status_code=422,
		content={"detail": exc.errors()},
	)


app.include_router(app_user.router)
app.include_router(app_ai.router)
