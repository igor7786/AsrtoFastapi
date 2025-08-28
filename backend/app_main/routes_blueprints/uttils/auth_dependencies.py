from app_main.imports import Annotated, OAuth2PasswordBearer, Depends

oauth= OAuth2PasswordBearer(tokenUrl="v1/auth/token")
dependency_oauth2_bearer = Annotated[str, Depends(oauth)]