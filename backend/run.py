from app_main.app_imports import uvicorn
if __name__ == '__main__':
	uvicorn.run(
		"app_main:app",
		host="0.0.0.0",
		port=8080,
		workers=4,
		reload=True,
	)