from joserfc.errors import JoseError
from app_main.app_routes_blueprints.uttils.auth_dependencies import dependency_oauth2_bearer
from app_main.app_global_helpers.app_logging import logger
from app_main.app_imports import select, CryptContext, timedelta, datetime, jwt, secret_key, HTTPException, timezone

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from app_main.app_models.models import Users


async def _auth_user(db, user_name, password):
	res = await db.exec(select(Users).where(Users.user_name == user_name))
	user = res.one_or_none()
	if user is None:
		return False
	return user if bcrypt_context.verify(password, user.hashed_password) else False


def _create_jwt_token(username: str, user_id: int, expires_delta: timedelta = 10):
	expires_delta = datetime.now(timezone.utc) + expires_delta
	encode = {"sub": username, "id": user_id, "exp": expires_delta}
	algorithm = {"alg": "HS256"}
	return jwt.encode(algorithm, encode, secret_key)


def _get_current_user(token: dependency_oauth2_bearer):
	try:
		algorithm = {"alg": "HS256"}
		payload = jwt.decode(token, secret_key, algorithms=[algorithm["alg"]])
		claims_requests = jwt.JWTClaimsRegistry()
		claims_requests.validate(payload.claims)
		user_name = payload.claims.get("sub")
		user_id = payload.claims.get("id")
		if user_name is None or user_id is None:
			raise HTTPException(
				status_code=401, detail="Could not validate user"
			)
		return {"username": user_name, "id": user_id}
	except JoseError as e:
		raise HTTPException(
			status_code=401, detail="Could not validate user"
		) from e
