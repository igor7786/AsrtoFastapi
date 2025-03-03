import sys
import timeit
import httpx
import asyncio
import uvloop
from tqdm import tqdm

# Target URL
URL = "https://igorfastapi.co.uk/api/v1/test"
URL_2 = "http://localhost:8000/api/v1/test"

# Number of requests to send
NUM_REQUESTS = 5000
FAILED = 0
PASSED = 0


# Lock to prevent race conditions
# semaphore = asyncio.Semaphore(500)  # Limit to 100 concurrent requests


async def fetch(client, request_id):
	global FAILED, PASSED
	# async with semaphore:  # Prevent overload
	try:
		# await asyncio.sleep(0.4)
		response = await client.get(URL)
		PASSED += 1
		return response.text
	except Exception as e:
		print(f"Request {request_id} failed: {e}")
		FAILED += 1
		return None


async def main():
	"""Create an HTTP client and send multiple requests asynchronously."""

	async with httpx.AsyncClient(
			http2=True,
			timeout=60,
			# headers={"Content-Type": "application/json"},
			# limits=httpx.Limits(max_connections=200, max_keepalive_connections=20)
	) as client:
		tasks = [fetch(client, i) for i in range(NUM_REQUESTS)]
		# Use tqdm to track progress
		# for completed_task in tqdm(asyncio.as_completed(tasks), total=len(tasks)):
		# 	await completed_task
		# Print results
		res = await asyncio.gather(*tasks)
		print(f"Total failed requests: {FAILED}")
		print(f"Total passed requests: {PASSED}")
	return res


# Run the script
if __name__ == "__main__":
	if sys.version_info >= (3, 11):
		with asyncio.Runner(loop_factory=uvloop.new_event_loop) as runner:
			total_time = timeit.timeit(lambda: runner.run(main()), number=1)
			print(f"Total time: {total_time:.2f} seconds")
	else:
		uvloop.install()
		asyncio.run(main(), debug=True)
# asyncio.run(main())
