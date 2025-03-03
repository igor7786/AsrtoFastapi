from app_main.app_imports import uvicorn, install
import granian
# ! handling exceptions with rich
install(show_locals=True)
if __name__ == '__main__':
	uvicorn.run(
		"app_main:app",
		host="0.0.0.0",
		port=8000,
		workers=4,
		# ssl_keyfile='./ssl/key.pem',
		# ssl_certfile='./ssl/cert.pem',
		reload=True,
	)
