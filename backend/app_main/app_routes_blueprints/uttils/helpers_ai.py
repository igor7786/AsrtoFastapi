from app_main.app_imports import (AsyncOpenAI, api_ai_key_gemma, api_ai_base_gemma, api_ai_key_qwen, api_ai_base_qwen,
                                  api_ai_model_qwen,
                                  api_ai_model_gemma, api_ai_key_gemmini, api_ai_model_gemmini, AsyncGenerator,
                                  json, genai, Tool, GoogleSearch, GenerateContentConfig, Generator)

ERR = "The server could not be reached at the moment try again later!!!"
STOP_STREAM_TEXT = ('{"finishReason":"stop","usage":{"promptTokens":"null","completionTokens":"null"},'
                    '"isContinued":"false"}')


async def stream_text_gemma(message) -> AsyncGenerator:
	"""
	Stream text from the model as a response to the provided messages.
	"""
	client = AsyncOpenAI(
		api_key=api_ai_key_qwen,
		base_url=api_ai_base_qwen
	)
	try:
		# Start a streaming request to OpenAI or Groq API
		response = await client.chat.completions.create(
			messages=[{"role": "user", "content": message}],
			model=api_ai_model_qwen,
			stream=True  # Enable streaming
		)
		# Yield each chunk of the response
		async for chunk in response:
			for choice in chunk.choices:
				if choice.finish_reason == "stop":
					yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
					continue
				yield '0:{text}\n'.format(text=json.dumps(choice.delta.content))

	except Exception:
		yield '0:{text}\n'.format(text=json.dumps(ERR))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)


def stream_text_gemmini(promt, image=None) -> Generator:
	client = genai.Client(api_key=api_ai_key_gemmini)
	model = api_ai_model_gemmini
	google_search_tool = Tool(google_search=GoogleSearch())
	content = [promt, image] if image else [promt]
	try:
		# Generate content with the model
		response = client.models.generate_content_stream(
			model=model,
			contents=content,  # ✅ Corrected format
			config=GenerateContentConfig(
				tools=[google_search_tool],
				response_modalities=["TEXT"],
				system_instruction="You are helpful assistant."
			),
		)
		for part in response:
			yield '0:{text}\n'.format(text=json.dumps(part.text))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
	except Exception:
		yield '0:{text}\n'.format(text=json.dumps(ERR))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
