from app_main.app_imports import BaseModel


def _update_class_fields(value_to_update: BaseModel, value_from_request: BaseModel, id: bool = False) -> None:
	"""Updates book fields dynamically.

	This function iterates through the provided `book_upd` data and updates the corresponding fields
	of the `upd_book` object.

	Args:
		value_to_update: The value object to be updated.
		value_from_request: A Pydantic model containing the updated value data.
	"""

	book_data = value_from_request.model_dump(exclude_unset=True)  # Get dict from Pydantic model
	for key, value in book_data.items():
		if key == "book_id" and id:
			continue
		setattr(value_to_update, key, value)
