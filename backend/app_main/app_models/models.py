from app_main.app_imports import SQLModel, Field, ConfigDict, EmailStr, field_validator, PydanticCustomError, BaseModel


class User(BaseModel):
	user_email: str
	user_name: str
	task: str

	@field_validator('user_email', mode="before")
	def validate_user_email(cls, value):
		if '@' not in value:
			raise PydanticCustomError(
				'Value error',
				'email must contain @ symbol',
				{'value': value, 'extra_context': 'extra_data'}
			)
		# Capitalize the fields if they exist
		return value.strip().lower()


class BaseSQLModel(SQLModel):
	model_config = ConfigDict(validate_assignment=True)


class Tasks(BaseSQLModel, table=True):
	task_id: int | None = Field(default=None, primary_key=True)
	task: str = Field(min_length=4, max_length=200)
	user_name: str | None = Field(min_length=4, max_length=20)
	user_email: EmailStr | None
