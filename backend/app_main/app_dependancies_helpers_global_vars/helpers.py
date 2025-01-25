from app_main.app_imports import AsyncOpenAI, api_ai_key, api_ai_base, api_ai_model, AsyncGenerator, json

client = AsyncOpenAI(api_key=api_ai_key, base_url=api_ai_base)


async def stream_text(message="") -> AsyncGenerator:
	"""
	Stream text from the model as a response to the provided messages.
	"""
	try:
		# Start a streaming request to OpenAI or Groq API
		response = await client.chat.completions.create(
			messages=[{"role": "user", "content": message}],
			model=api_ai_model,
			stream=True  # Enable streaming
		)
		# Yield each chunk of the response
		async for chunk in response:
			for choice in chunk.choices:
				if choice.finish_reason == "stop":
					yield ('e:{"finishReason":"stop","usage":{"promptTokens":null,"completionTokens":null},'
					       '"isContinued":false}\n')
					continue
				yield '0:{text}\n'.format(text=json.dumps(choice.delta.content))

	except Exception as e:
		yield f"Error: {str(e)}"
