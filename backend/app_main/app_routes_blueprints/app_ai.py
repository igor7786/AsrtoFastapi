from app_main.app_imports import StreamingResponse, BaseModel, APIRouter, Annotated, Optional, List, File, UploadFile, \
	Form, io, Image, JSONResponse
from app_main.app_dependancies_helpers_global_vars.helpers import stream_text_gemma, stream_text_gemmini


class Query(BaseModel):
	prompt: str


router = APIRouter(prefix="/v1/AI", tags=["AI-Models"])


@router.post("/generate-gemma")
async def generate_text(query: Query):
	try:
		q = query.prompt
		if not q.strip():
			return JSONResponse(content={"error": "Prompt cannot be empty"}, status_code=422)
		return StreamingResponse(
			stream_text_gemma(q),
			media_type="text/event-stream",  # Ensure no caching of the response
			status_code=201
		)
	except Exception:
		return JSONResponse(content={"error": "Something went wrong"}, status_code=400)


# Define the endpoint to receive the request
@router.post("/generate-gemmini")
async def receive_data(prompt: Annotated[str, Form()], files: Annotated[Optional[list[UploadFile]], File()] = None):
	try:
		if not prompt.strip():
			return JSONResponse(content={"error": "Prompt cannot be empty"}, status_code=422)
		if not files:
			return StreamingResponse(stream_text_gemmini(prompt), media_type="text/event-stream", status_code=201)
		for f in files:
			# Read file contents
			contents = await f.read()
			# Convert to Image using PIL
			image = Image.open(io.BytesIO(contents))
			image_resized = image.resize((600, 480))
			return StreamingResponse(
				stream_text_gemmini(prompt, image_resized), media_type="text/event-stream", status_code=201
			)
	except Exception:
		return JSONResponse(content={"error": "Something went wrong"}, status_code=400)
