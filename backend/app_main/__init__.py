from app_main.app_imports import FastAPI, CORSMiddleware, ValidationError, Request, JSONResponse, FastApiMCP
from app_main.app_models.models import Users, Books
from app_main.app_routes_blueprints import app_books_store, app_ai, app_auth, app_test
from app_main.app_middleware.app_csrf_middleware import CSRFMiddleware
from app_main.app_imports import install
import granian
from app_main.app_routes_blueprints.uttils.dependancies import get_db
from app_main.settings.config import settings
from app_main.app_routes_blueprints.uttils.lifespan_onstart import lifespan

# ! handling exceptions with rich
install(show_locals=True)
from rich import print

app = FastAPI(lifespan=lifespan)
mcp = FastApiMCP(
		app,
		name="My API MCP",
		description="Very cool MCP server",
		describe_all_responses=True,
		describe_full_response_schema=True,
		include_operations=['test'],
	)
mcp.mount()
#### mcp = FastMCP("MyServer")
#### mcp_app = mcp.http_app(path="/mcp", transport='sse')
#### app = FastAPI(lifespan=mcp_app.lifespan)
#### app.mount("/", mcp_app)
#### Add the CSRF middleware
# app.add_middleware(CSRFMiddleware)
app.add_middleware(
	CORSMiddleware,
	#allow_origins=["http://localhost:4321"],  # 👈 Add protocol (http://)
	allow_origins=["*"],
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
mcp.setup_server()

#### Create an MCP server from your FastAPI app
#### mcp = FastMCP.from_fastapi(app=app)