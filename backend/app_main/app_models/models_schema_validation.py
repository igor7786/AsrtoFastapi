from app_main.app_global_helpers.app_logging import logger
from app_main.app_imports import (Field, ConfigDict, EmailStr, field_validator, BaseModel, FieldValidationInfo,
                                  Optional, datetime, timedelta)


# ! ############ User schema ##############
class User(BaseModel):
	id: Optional[int] = Field(default=None, primary_key=True)
	first_name: str
	last_name: str
	email: EmailStr
	dob: datetime = datetime.now().date()
	is_active: bool
	role: str
	hashed_password: str

	@field_validator('dob', mode="before")
	def check_minimum_age(cls, v: datetime, MIN_AGE=18) -> datetime:
		"""Ensure that the user is at least 18 years old"""
		# Convert string input to datetime object if needed
		if isinstance(v, str):
			v = datetime.strptime(v, "%Y-%m-%d")
		# Get the current date
		now = datetime.now()
		# Calculate the minimum birthdate required for 18 years old
		min_birthdate = now - timedelta(days=MIN_AGE * 365.25)
	# Check if the user is at least 18 years old
		if v > min_birthdate:
			raise ValueError(f"User must be at least {MIN_AGE} years old")
		return v  # Return the parsed datetime object


# ! ################### Book schema ################
class Book(BaseModel):
	id: Optional[int] = Field(default=None, description="No need to pass book_id only if you want to update")
	name: str
	genre: str
	rating: int

	# ConfigDict for validation and ordering
	model_config = ConfigDict(
		validate_assignment=True,
		strict=True,
		extra="forbid",  # Rejects unknown fields
		json_schema_extra={
			"example": {
				# "book_id": 1,
				"name": "NAME",
				"genre": "GENRE",
				"rating": 5
			}
		}
	)

	# ! Validate book_author and compare it with book_name -> make sure passing last field to compare with
	# ! Make sure this validator is before capitalize_fields
	@field_validator("genre", mode="before")
	def validate_book_author(cls, v: str, info: FieldValidationInfo) -> str:
		# Check if "book_name" exists in the input data
		if "name" in info.data:
			book_name_clean = info.data["name"].strip().lower()
			# Normalize the input: remove extra spaces and make it lowercase
			book_author_clean = v.strip().lower()

			if book_author_clean == book_name_clean:
				raise ValueError("Book name and Book author cannot be the same (case-insensitive)!")

		return v.strip().title()

	@field_validator("name", "genre", mode="before")
	def capitalize_fields(cls, value: str) -> str:
		if value.lower() in {"none", "null", ""}:  # Reject "None", "null", or empty string
			raise ValueError(f"{value} is not a valid value for book_name or book_author")
		return value.title()





# validation of user input data when user enters the data to endpoint
# class User(BaseModel):
# 	user_email: str
# 	user_name: str
# 	task: str
#
# 	@field_validator('user_email', mode="before")
# 	def validate_user_email(cls, value):
# 		if '@' not in value:
# 			raise PydanticCustomError(
# 				'Value error',
# 				'email must contain @ symbol',
# 				{'value': value, 'extra_context': 'extra_data'}
# 			)
# 		# Capitalize the fields if they exist
# 		return value.strip().lower()
#
#
# class Tasks(BaseSQLModel, table=True):
# 	task_id: int | None = Field(default=None, primary_key=True)
# 	task: str = Field(min_length=4, max_length=200)
# 	user_name: str | None = Field(min_length=4, max_length=20)
# 	user_email: EmailStr | None