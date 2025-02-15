from app_main.app_imports import SQLModel, Field, ConfigDict, EmailStr, Optional, datetime, Relationship
from app_main.app_models.models_schema_validation import User, Book


# ! configure pydantic -> for validation errors availability
class BaseSQLModel(SQLModel):
	model_config = ConfigDict(validate_assignment=True)


# ! #################### Users table make sure passing BaseSQLModel, Book, table=True  ################
class Users(BaseSQLModel, User, table=True):
	id: Optional[int] = Field(default=None, primary_key=True)
	first_name: str = Field(index=True, min_length=4, max_length=20)
	last_name: str = Field(min_length=4, max_length=20)
	email: EmailStr = Field(unique_items=True, regex=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
	dob: datetime
	is_active: bool = Field(default=True)
	role: str = Field(min_length=4, max_length=20)
	hashed_password: str
	# ! can be list of books, on delete cascade
	books: list["Books"] = Relationship(back_populates="users", sa_relationship_kwargs={"cascade": "all"})


# ! #################### Books table make sure passing BaseSQLModel, Book, table=True  ################
class Books(BaseSQLModel, Book, table=True):
	id: Optional[int] = Field(default=None, primary_key=True)
	name: str = Field(index=True, min_length=4, max_length=200)
	genre: str = Field(min_length=4, max_length=20)
	rating: int = Field(gt=0, lt=6, default=1)
	user_id: Optional[int] = Field(default=None, foreign_key="users.id")
	# ! can be one user
	users: "Users" = Relationship(back_populates="books")
