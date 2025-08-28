from app_main.imports import FastAPI, Depends, CORSMiddleware, ValidationError, Request, JSONResponse, FastApiMCP
from app_main.models.models import Users, Books
from app_main.routes_blueprints import app_books_store, app_ai, app_auth, app_test
from app_main.middlewares.app_csrf_middleware import CSRFMiddleware
from app_main.imports import install
import granian
from redis.asyncio import Redis
from app_main.routes_blueprints.uttils.dependancies import get_db
from app_main.settings.config import settings
from app_main.routes_blueprints.uttils.lifespan_onstart import lifespan
from app_main.settings.config import settings
from app_main.global_helpers.app_logging import logger
from app_main.routes_blueprints.uttils.app_redis import RedisManager
from fastapi import Response

# ! handling exceptions with rich
install(show_locals=True)
from rich import print
from app_main.settings.config import settings

redis = Redis.from_url(settings.REDIS_URL_DOCKER)
app = FastAPI(lifespan=lifespan)
# Add middleware
try:
	mcp = FastApiMCP(
		app,
		name="My API MCP",
		description="Very cool MCP server",
		describe_all_responses=True,
		describe_full_response_schema=True,
		include_operations=['test'],
	)
	mcp.mount()  # Mounts at default /mcp path
except Exception as e:
	logger.error(e)
#### mcp = FastMCP("MyServer")
#### mcp_app = mcp.http_app(path="/mcp", transport='sse')
#### app = FastAPI(lifespan=mcp_app.lifespan)
#### app.mount("/", mcp_app)
#### Add the CSRF middleware
# app.add_middleware(CSRFMiddleware)
app.add_middleware(
	CORSMiddleware,
	# allow_origins=["http://localhost:4321"],  # 👈 Add protocol (http://)
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


def get_redis_manager(request: Request) -> RedisManager:
	return request.app.state.redis_manager


from fastapi import Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Any
import json


class TokenPayload(BaseModel):
	token_data: Any
	expire_seconds: Optional[int] = Field(3600, description="Token expiration time in seconds")


@app.post("/session/{session_id}")
async def store_token(
		session_id: str,
		payload: TokenPayload,
		redis: RedisManager = Depends(get_redis_manager)
):
	# No need to json.loads because FastAPI already parsed JSON for you.
	# Just store the token_data (convert to JSON string if needed)
	import json

	token_data_str = json.dumps(payload.token_data)  # serialize Python object to JSON string

	try:
		await redis.set_token(session_id, token_data_str, payload.expire_seconds)
	except Exception:
		raise HTTPException(status_code=500, detail="Failed to store token")

	return {
		"status": "success",
		"session_id": session_id,
		"expire_seconds": payload.expire_seconds,
		"message": "Token stored successfully"
	}


@app.get("/session/{session_id}")
async def fetch_token(
		session_id: str,
		redis: RedisManager = Depends(get_redis_manager)
):
	token = await redis.get_token(session_id)
	return {
		"session_id": session_id,
		"stored_token": token
	}


# @app.get("/debug/redis-keys")
# async def list_keys():
# 	keys = await app.state.redis_manager.list_keys()
# 	return {"keys": keys}


app.include_router(app_test.router)
app.include_router(app_auth.router)
app.include_router(app_books_store.router)
app.include_router(app_ai.router)
mcp.setup_server()

#### Create an MCP server from your FastAPI app
#### mcp = FastMCP.from_fastapi(app=app)
