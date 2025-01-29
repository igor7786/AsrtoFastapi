from app_main.app_imports import StreamingResponse, BaseModel, APIRouter, Depends
from app_main.app_dependancies_helpers_global_vars.helpers import stream_text, stream_text_hf


class Query(BaseModel):
	prompt: str


router = APIRouter(prefix="/AI", tags=["AIollama"])


@router.post("/generate")
async def generate_text(query: Query, ):
	if not query.prompt.strip():
		return {"error": "Prompt cannot be empty"}
	return StreamingResponse(
		stream_text(query.prompt),
		media_type="text/event-stream",  # Ensure no caching of the response
	)


@router.post("/generatehf")
async def generate_text(query: Query):
	return StreamingResponse(
		stream_text_hf(query.prompt),
		media_type="text/event-stream",  # Ensure no caching of the response
	)# Ensure no caching of the response

