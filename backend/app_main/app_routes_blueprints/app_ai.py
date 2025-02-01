from app_main.app_imports import StreamingResponse, BaseModel, APIRouter, Annotated, Optional, List, File, UploadFile, \
	Form, io, Image
from app_main.app_dependancies_helpers_global_vars.helpers import stream_text_gemma, stream_text_gemmini, _stream_error


class Query(BaseModel):
	prompt: str
	attachments: Optional[List[str]] = None


router = APIRouter(prefix="/v1/AI", tags=["AI-Models"])


@router.post("/generate-gemma")
async def generate_text(query: Query):
	q = query.prompt
	if not q.strip():
		return {"error": "Prompt cannot be empty"}
	if query.attachments:
		attachments = query.attachments
		return StreamingResponse(
			stream_text_gemmini(q, attachments),
			media_type="text/event-stream",  # Ensure no caching of the response
		)
	return StreamingResponse(
		stream_text_gemma(q),
		media_type="text/event-stream",  # Ensure no caching of the response
	)


# Define the Pydantic model for the request body
class AIRequest(BaseModel):
	prompt: Annotated[str, Form()]
	files: Annotated[Optional[List[UploadFile]], Form()] = None  # Files are optional


# Define the endpoint to receive the request
@router.post("/generate-gemmini")
async def receive_data(prompt: Annotated[str, Form()], files: Annotated[list[UploadFile], File()] = None):
	try:
		if not prompt.strip():
			return StreamingResponse(_stream_error(), media_type="text/event-stream")
		if not files:
			return StreamingResponse(stream_text_gemmini(prompt), media_type="text/event-stream")
		for f in files:
			# Read file contents
			contents = await f.read()
			# Convert to Image using PIL
			image = Image.open(io.BytesIO(contents))
			return StreamingResponse(stream_text_gemmini(prompt, image), media_type="text/event-stream")

	except Exception:
		return StreamingResponse(_stream_error(), media_type="text/event-stream")
