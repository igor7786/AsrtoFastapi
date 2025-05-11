from app_main.app_imports import SQLModel, Field, ConfigDict, EmailStr, Optional, datetime, Relationship, uuid
from app_main.app_models.models_schema_validation import User, Book
from sqlalchemy import UniqueConstraint, Column, String


# ! configure pydantic -> for validation errors availability
class BaseSQLModel(SQLModel):
	model_config = ConfigDict(validate_assignment=True)


# ! #################### Users table make sure passing BaseSQLModel, Book, table=True  ################
class Users(BaseSQLModel, User, table=True):
	id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
	user_name: str = Field(min_length=4, max_length=20, sa_column=Column("user_name", String, unique=True, index=True))
	first_name: str = Field(min_length=4, max_length=20)
	last_name: str = Field(min_length=4, max_length=20)
	email: EmailStr = Field(sa_column=Column("email", String, unique=True))
	dob: datetime
	is_active: bool = Field(default=True)
	role: str = Field(min_length=4, max_length=20)
	hashed_password: str
	# ! can be list of books, on delete cascade
	books: list["Books"] = Relationship(back_populates="users", sa_relationship_kwargs={"cascade": "all"})


# ! #################### Books table make sure passing BaseSQLModel, Book, table=True  ################
class Books(BaseSQLModel, Book, table=True):
	id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
	name: str = Field(index=True, min_length=4, max_length=200)
	genre: str = Field(min_length=4, max_length=20)
	rating: int = Field(gt=0, lt=6, default=1)
	user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
	# ! can be one user
	users: "Users" = Relationship(back_populates="books")
