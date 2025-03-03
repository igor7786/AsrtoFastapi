from contextlib import asynccontextmanager
import ssl
from httpx import AsyncClient, Timeout
from app_main.app_imports import FastAPI, CORSMiddleware, ValidationError, Request, JSONResponse
from app_main.app_models.models import Users, Books
from app_main.app_routes_blueprints import app_books_store, app_ai, app_auth, app_test
from app_main.app_middleware.app_csrf_middleware import CSRFMiddleware

timeout = Timeout(30.0, connect=5.0)


# from rich import print
@asynccontextmanager
async def lifespan(app: FastAPI):
	# Initialize a shared HTTP/2 client for the application
	app.http_client = AsyncClient(http2=True, timeout=timeout)
	yield  # Application is running
	await app.http_client.aclose()


app = FastAPI(lifespan=lifespan)
# Add the CSRF middleware
# app.add_middleware(CSRFMiddleware)
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


app.include_router(app_test.router)
app.include_router(app_auth.router)
app.include_router(app_books_store.router)
app.include_router(app_ai.router)
