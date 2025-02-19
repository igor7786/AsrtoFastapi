
from app_main.app_imports import uvicorn, install

# ! handling exceptions with rich
install(show_locals=True)

if __name__ == '__main__':
	uvicorn.run("app_main:app", host="localhost", port=8080, reload=True)
