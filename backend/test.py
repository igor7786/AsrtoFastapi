import httpx
import asyncio


# Define an async function
# async def fetch_data():
#     async with httpx.AsyncClient() as client:
#         response = await client.get("https://igorfastapi.co.uk/api/v1/books-store/books")
#         print(response.text)  # Print the response as JSON
#     asyncio.run(fetch_data())
# # Run the async function
# if __name__ == "__main__":
#     fetch_data()

def main():
	async def fetch_data():

		async with httpx.AsyncClient() as client:
			response = await client.get("https://igorfastapi.co.uk/api/v1/books-store/books")
			print(response.text)  # Print the response as JSON

	async def send_multiple_requests():
		tasks = []
		for _ in range(2500):
			print("Fetching data...", _)# Send 20 requests
			tasks.append(fetch_data())
		await asyncio.gather(*tasks)

	asyncio.run(send_multiple_requests())


# # Run the async function

if __name__ == "__main__":
	main()
