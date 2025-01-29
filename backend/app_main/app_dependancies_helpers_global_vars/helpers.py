from app_main.app_imports import (AsyncOpenAI, OpenAIError, openai, api_ai_key_gemma, api_ai_base_gemma,
                                  api_ai_model_gemma, api_ai_key_hf, api_ai_base_hf, api_ai_model_hf, AsyncGenerator,
                                  json)

STOP_STREAM_TEXT = ('{"finishReason":"stop","usage":{"promptTokens":"null","completionTokens":"null"},'
                    '"isContinued":"false"}')
import openai


async def stream_text(message) -> AsyncGenerator:
	"""
	Stream text from the model as a response to the provided messages.
	"""
	client = AsyncOpenAI(api_key=api_ai_key_gemma, base_url=api_ai_base_gemma)
	try:
		# Start a streaming request to OpenAI or Groq API
		response = await client.chat.completions.create(
			messages=[{"role": "user", "content": message}],
			model=api_ai_model_gemma,
			stream=True  # Enable streaming
		)
		# Yield each chunk of the response
		async for chunk in response:
			for choice in chunk.choices:
				if choice.finish_reason == "stop":
					yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
					continue
				yield '0:{text}\n'.format(text=json.dumps(choice.delta.content))

	except openai.APIConnectionError as e:
		err = f"{e} The server could not be reached"
		yield '0:{text}\n'.format(text=json.dumps(err))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
	except OpenAIError as e:
		err = e.body.get("message", "An error occurred")
		yield '0:{text}\n'.format(text=json.dumps(err))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)


async def stream_text_hf(message):
	try:
		client = AsyncOpenAI(base_url=api_ai_base_hf, api_key=api_ai_key_hf)
		messages = [{"role": "user", "content":"dont use think in your response" + message}]
		response = await client.chat.completions.create(
			model=api_ai_model_hf,
			messages=messages,
			stream=True
		)
		async for chunk in response:
			print(chunk)
			for choice in chunk.choices:
				if choice.finish_reason == "stop":
					yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
					continue
				yield '0:{text}\n'.format(text=json.dumps(choice.delta.content))
	except Exception as e:
		err = e.body
		yield '0:{text}\n'.format(text=json.dumps(err))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
	except openai.APIConnectionError as e:
		err = f"{e} The server could not be reached"
		yield '0:{text}\n'.format(text=json.dumps(err))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
	except OpenAIError as e:
		err = e.body.get("message", "An error occurred")
		yield '0:{text}\n'.format(text=json.dumps(err))
		yield 'e:{text}\n'.format(text=STOP_STREAM_TEXT)
