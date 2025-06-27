import openai
from openai import OpenAIError

# Replace with your key
openai.api_key = "sk-..."

try:
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}],
    )
    print("✅ API key works!")
    print(response.choices[0].message.content)

except openai.AuthenticationError:
    print("❌ Invalid API key.")
except OpenAIError as e:
    print(f"⚠️ Some other OpenAI error: {e}")