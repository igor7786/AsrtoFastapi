from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
import secrets


class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # For unsafe methods (e.g., POST, PUT, DELETE), validate the CSRF token
        if request.method in ["POST", "PUT", "DELETE"]:
            csrf_token = secrets.token_hex(16)  # Generate a secure random token
            response = await call_next(request)
            response.headers["X-CSRF-Token"] = csrf_token
             # Send token to the client
        if request.method in ["POST", "PUT", "DELETE"]:
            check_csrf_token = request.headers.get("X-CSRF-Token")

            if not check_csrf_token or check_csrf_token != csrf_token:
                raise HTTPException(status_code=403, detail="Invalid or missing CSRF token")
        return await call_next(request)
        # For POST, PUT, DELETE methods, generate and send CSRF token in the response headers

        # return response