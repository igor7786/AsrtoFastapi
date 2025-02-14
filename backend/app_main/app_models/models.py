from app_main.app_imports import (SQLModel, Field, ConfigDict, EmailStr, field_validator, PydanticCustomError,
                                  BaseModel, FieldValidationInfo, Optional)


# ! configure pydantic -> for validation errors availability
class BaseSQLModel(SQLModel):
	model_config = ConfigDict(validate_assignment=True)


# validation of user input data when user enters the data to endpoint
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


class Tasks(BaseSQLModel, table=True):
	task_id: int | None = Field(default=None, primary_key=True)
	task: str = Field(min_length=4, max_length=200)
	user_name: str | None = Field(min_length=4, max_length=20)
	user_email: EmailStr | None


################### Book schema ################
class Book(BaseModel):
	book_id: Optional[int] = Field(default=None, description="No need to pass book_id only if you want to update")
	book_name: str
	book_author: str
	book_rating: int

	# ConfigDict for validation and ordering
	model_config = ConfigDict(
		validate_assignment=True,
		strict=True,
		extra="forbid",  # Rejects unknown fields
		json_schema_extra={
			"example": {
				# "book_id": 1,
				"book_author": "AUTHOR",
				"book_name": "NAME",
				"book_rating": 5
			}
		}
	)

	@field_validator("book_name", "book_author", mode="before")
	def capitalize_fields(cls, value: str) -> str:
		if value.lower() in {"none", "null", ""}:  # Reject "None", "null", or empty string
			raise ValueError(f"{value} is not a valid value for book_name or book_author")
		return value.title()


# ! Validate book_author and compare it with book_name -> make sure passing last field to compere with
@field_validator("book_author", mode="before")
def validate_book_author(cls, v, info: FieldValidationInfo) -> str:
	# ! Correct way to access another field
	if 'book_name' in info.data and v == info.data["book_name"]:
		raise ValueError("book_name and book_author cannot be the same")
	return v


# ! #################### Books table make sure passing BaseSQLModel, Book, table=True  ################
class Books(BaseSQLModel, Book, table=True):
	book_id: int | None = Field(default=None, primary_key=True)
	book_name: str = Field(min_length=4, max_length=200)
	book_author: str = Field(min_length=4, max_length=20)
	book_rating: int = Field(gt=0, lt=6, default=1)
