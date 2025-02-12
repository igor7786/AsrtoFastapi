from app_main.app_imports import FastAPI, CORSMiddleware, ValidationError, Request, JSONResponse
from app_main.app_models.models import Tasks, Books
from app_main.app_routes_blueprints import app_books_store, app_user, app_ai
from app_main.app_middleware.app_csrf_middleware import CSRFMiddleware

# from rich import print

app = FastAPI()
# Add the CSRF middleware
# app.add_middleware(CSRFMiddleware)
# CORSMiddleware(app, allow_origins=["http://localhost:8080"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],  # 👈 Add protocol (http://)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
	return JSONResponse(
		status_code=422,
		content={"detail": exc.errors()},
	)


app.include_router(app_user.router)
app.include_router(app_ai.router)
app.include_router(app_books_store.router)
