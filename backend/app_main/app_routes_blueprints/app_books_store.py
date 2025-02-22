from datetime import datetime
from uuid import UUID

from app_main.app_imports import (APIRouter, select, Query, Body, FastApiPath, Response, HTTPException, JSONResponse,
                                  jsonable_encoder)
from app_main.app_routes_blueprints.uttils.dependancies import current_user, dependency_db, dependency_time_now
from app_main.app_models.models import Book, Books, Users
from app_main.app_global_helpers.app_logging import logger
from app_main.app_routes_blueprints.uttils.helpers_book import _update_class_fields

PREFIX = "/v1/books-store"

router = APIRouter(prefix=PREFIX, tags=["Books-Store"])
logger.warning(f'route endpoint-> {PREFIX}')


@router.get("/books", status_code=200)
async def get_all_books(db: dependency_db, time_now: dependency_time_now) -> JSONResponse:
	result = await db.exec(select(Books))
	all_books = result.all()
	return JSONResponse(
		content={'allBooks': jsonable_encoder(all_books), "dateCreated": f"{time_now}"},
		status_code=200,
		headers={"Location": f"{PREFIX}/books"},
	)


@router.get("/book", status_code=200)
async def interactive_book_search(
		db: dependency_db,
		time_now: dependency_time_now,
		q: str = Query(min_length=4, max_length=200),
) -> JSONResponse:
	logger.info(q)
	book_q = select(Books, Users).where(Books.name.ilike(f"%{q}%")).where(Books.user_id == Users.id)  # Adjust based on
	result = await db.exec(book_q)  # Execute the query
	all_books = result.all()
	user_dict = {}
	for book, user in all_books:
		user_id = str(user.id)  # Convert UUID to string for JSON serialization
		if user_id not in user_dict:
			user_dict[user_id] = {
				"id": user.id,
				"first_name": user.first_name,
				"last_name": user.last_name,
				"user_name": user.user_name,
				"email": user.email,
				"dob": user.dob,
				"is_active": user.is_active,
				"role": user.role,
				"books": []
			}
		user_dict[user_id]["books"].append(
			{
				"id": book.id,
				"name": book.name,
				"genre": book.genre,
				"rating": book.rating,
				"user_id": book.user_id
			}
		)
	custom_encoder = {
		datetime: lambda dt: dt.strftime("%d-%m-%Y"),  # Custom datetime format
		UUID: lambda u: str(u)[:8]  # Shortened UUID format
	}
	return JSONResponse(
		content={
			"searchedBooksAndUsers": jsonable_encoder(
				list(user_dict.values()),
				custom_encoder=custom_encoder, exclude={"id"},
			),
			"dateCreated": f"{time_now}"
		},
		status_code=200,
		headers={"Location": f"{PREFIX}/book"},
	)


@router.post("/book", status_code=201)
async def create_book(db: dependency_db, time_now: dependency_time_now, book: Book) -> JSONResponse:
	cr_book = Books(**book.model_dump(exclude_unset=True))
	db.add(cr_book)
	await db.commit()
	await db.refresh(cr_book)
	return JSONResponse(
		content={"createdBook": "success", "dateCreated": f"{time_now}"},
		status_code=201,
		headers={"Location": f"{PREFIX}/book/{cr_book.id}"},  # Add Location Header
	)


@router.put("/book-name/{book_id}", status_code=204)
async def update_book_name(
		db: dependency_db,
		book_id: int = FastApiPath(gt=0),
		upd_book_name: str = Body(..., embed=True, min_length=4, max_length=200),
) -> Response:
	res = await db.exec(select(Books).where(Books.id == book_id))
	q_book = res.one_or_none()
	if q_book is None:
		raise HTTPException(status_code=404, detail="Book not found")
	q_book.name = upd_book_name
	db.add(q_book)
	await db.commit()
	await db.refresh(q_book)
	return Response(status_code=204)  # No Content


@router.put("/book/{book_id}", status_code=204)
async def update_book(db: dependency_db, book_upd: Book, book_id: int = FastApiPath(gt=0)) -> Response:
	res = await db.exec(select(Books).where(Books.id == book_id))
	upd_book = res.one_or_none()
	if upd_book is None:
		raise HTTPException(status_code=404, detail="Book not found")
	# ! Update fields dynamically
	_update_class_fields(upd_book, book_upd, id=True)
	db.add(upd_book)
	await db.commit()
	await db.refresh(upd_book)
	return Response(status_code=204)  # No Content


@router.delete("/book/{del_book_id}", status_code=204)
async def delete_book(db: dependency_db, del_book_id: int = FastApiPath(gt=0)) -> Response:
	res = await db.exec(select(Books).where(Books.id == del_book_id))
	q_book = res.one_or_none()
	if q_book is None:
		raise HTTPException(status_code=404, detail="Book not found")
	await db.delete(q_book)
	await db.commit()
	return Response(status_code=204)  # No Content
