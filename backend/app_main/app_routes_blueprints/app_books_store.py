from app_main.app_imports import APIRouter, Depends, AsyncSession, select, datetime, Query, Body
from app_main.app_dependancies_helpers_global_vars.dependencies import get_db
from app_main.app_models.models import Book, Books

router = APIRouter(prefix="/v1/books-store", tags=["Books-Store"])
DATE_TIME_NOW = datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@router.get("/books")
async def get_all_books(db: AsyncSession = Depends(get_db)) -> dict:
	result = await db.exec(select(Books))
	all_books = result.all()
	return {'allBooks': all_books, "dateCreated": f"{DATE_TIME_NOW}"}


# noinspection PyTypeChecker
@router.get("/book")
async def get_book(q: str = Query(None, min_length=4, max_length=200), db: AsyncSession = Depends(get_db)) -> dict:
	book_q = select(Books).where(Books.book_name.ilike(f"%{q}%"))  # Adjust based on your model
	result = await db.exec(book_q)  # Execute the query
	all_books = result.all()  # Fetch results
	return {"searchedBooks": all_books, "dateCreated": f"{DATE_TIME_NOW}"}


@router.post("/book")
async def create_book(book: Book, db: AsyncSession = Depends(get_db)) -> dict:
	cr_book = Books(**book.model_dump())
	db.add(cr_book)
	await db.commit()
	await db.refresh(cr_book)
	return {"createdBook": "success", "dateCreated": f"{DATE_TIME_NOW}"}


# noinspection PyTypeChecker
@router.put("/book/{book_id}")
async def update_book(
		book_id: int, upd_book_name: str = Body(..., embed=True, min_length=4, max_length=200), db: AsyncSession = (
				Depends(get_db))
) -> dict:
	res = await db.exec(select(Books).where(Books.book_id == book_id))
	q_book = res.one_or_none()
	print(q_book, upd_book_name)
	if not q_book:
		return {"updateBook": "failed", "dateCreated": f"{DATE_TIME_NOW}"}
	q_book.book_name = upd_book_name
	db.add(q_book)
	await db.commit()
	await db.refresh(q_book)
	return {"updatedBook": "success", "dateCreated": f"{DATE_TIME_NOW}"}


# noinspection PyTypeChecker
@router.delete("/book/{del_book_id}")
async def delete_book(del_book_id: int, db: AsyncSession = Depends(get_db)) -> dict:
	res = await db.exec(select(Books).where(Books.book_id == del_book_id))
	q_book = res.one_or_none()
	if not q_book:
		return {"deleteBook": "failed", "dateCreated": f"{DATE_TIME_NOW}"}
	await db.delete(q_book)
	await db.commit()
	return {"deletedBook": "success", "dateCreated": f"{DATE_TIME_NOW}"}
