from openai import OpenAI

from app_main.app_imports import (AsyncOpenAI, api_ai_key, api_ai_base, api_ai_model, api_ai_key_hf, api_ai_base_hf,
                                  api_ai_model_hf, AsyncGenerator, json)

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


async def stream_text_hf(message=""):
	client = AsyncOpenAI(
		base_url=api_ai_base_hf,
		api_key=api_ai_key_hf
	)

	messages = [
		{
			"role": "user",
			"content": message
		}
	]

	completion = await client.chat.completions.create(
		model=api_ai_model_hf,
		messages=messages,
		max_tokens=500,
		stream=True
	)
	async for chunk in completion:
		yield chunk.choices[0].delta.content

