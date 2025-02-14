from app_main.app_imports import (APIRouter, Depends, AsyncSession, select, datetime, Query, Body, FastApiPath,
                                  Response, HTTPException, JSONResponse, jsonable_encoder)
from app_main.app_dependancies_helpers_global_vars.dependencies import get_db
from app_main.app_models.models import Book, Books

PREFIX = "/v1/books-store"
router = APIRouter(prefix=PREFIX, tags=["Books-Store"])
DATE_TIME_NOW = datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@router.get("/books", status_code=200)
async def get_all_books(db: AsyncSession = Depends(get_db)) -> JSONResponse:
	result = await db.exec(select(Books))
	all_books = result.all()
	return JSONResponse(
		content={'allBooks': jsonable_encoder(all_books), "dateCreated": f"{DATE_TIME_NOW}"},
		status_code=200,
		headers={"Location": f"{PREFIX}/books"},
	)


# noinspection PyTypeChecker,PyUnresolvedReferences
@router.get("/book", status_code=200)
async def interactive_book_search(
		q: str = Query(None, min_length=4, max_length=200),
		db: AsyncSession = Depends(get_db)
) -> JSONResponse:
	book_q = select(Books).where(Books.book_name.ilike(f"%{q}%"))  # Adjust based on your model
	result = await db.exec(book_q)  # Execute the query
	all_books = result.all()  # Fetch results
	return JSONResponse(
		content={"searchedBooks": jsonable_encoder(all_books), "dateCreated": f"{DATE_TIME_NOW}"},
		status_code=200,
		headers={"Location": f"{PREFIX}/book"},
	)


@router.post("/book", status_code=201)
async def create_book(book: Book, db: AsyncSession = Depends(get_db)) -> JSONResponse:
	cr_book = Books(**book.model_dump(exclude_unset=True))
	db.add(cr_book)
	await db.commit()
	await db.refresh(cr_book)
	return JSONResponse(
		content={"createdBook": "success", "dateCreated": f"{DATE_TIME_NOW}"},
		status_code=201,
		headers={"Location": f"{PREFIX}/book/{cr_book.book_id}"},  # Add Location Header
	)


# noinspection PyTypeChecker
@router.put("/book/{book_id}", status_code=204)
async def update_book_name(
		book_id: int = FastApiPath(gt=0),
		upd_book_name: str = Body(..., embed=True, min_length=4, max_length=200),
		db: AsyncSession = (Depends(get_db))
) -> Response:
	res = await db.exec(select(Books).where(Books.book_id == book_id))
	q_book = res.one_or_none()
	if not q_book:
		raise HTTPException(status_code=404, detail="Book not found")
	q_book.book_name = upd_book_name
	db.add(q_book)
	await db.commit()
	await db.refresh(q_book)
	return Response(status_code=204)  # No Content


# noinspection PyTypeChecker
@router.put("/book", status_code=204)
async def update_book(
		book_upd: Book,
		db: AsyncSession = (Depends(get_db))
) -> Response:
	res = await db.exec(select(Books).where(Books.book_id == book_upd.book_id))
	upd_book = res.one_or_none()
	if not upd_book:
		raise HTTPException(status_code=404, detail="Book not found")
	# ✅ Correct way: Update fields dynamically
	book_data = book_upd.model_dump(exclude_unset=True)  # Get dict from Pydantic model
	for key, value in book_data.items():
		setattr(upd_book, key, value)  # Dynamically update fields
	db.add(upd_book)
	await db.commit()
	await db.refresh(upd_book)
	return Response(status_code=204)  # No Content


# noinspection PyTypeChecker
@router.delete("/book/{del_book_id}", status_code=204)
async def delete_book(
		del_book_id: int = FastApiPath(gt=0),
		db: AsyncSession = Depends(get_db)
) -> Response:
	res = await db.exec(select(Books).where(Books.book_id == del_book_id))
	q_book = res.one_or_none()
	if not q_book:
		raise HTTPException(status_code=404, detail="Book not found")
	await db.delete(q_book)
	await db.commit()
	return Response(status_code=204)  # No Content
