"""book model: rating added

Revision ID: 4e0d9eb5b160
Revises: fc81d6ceb2f6
Create Date: 2025-02-13 00:45:06.583735

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '4e0d9eb5b160'
down_revision: Union[str, None] = 'fc81d6ceb2f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create a new table with the updated schema
    op.create_table(
        'books_new',
        sa.Column('book_id', sa.Integer(), primary_key=True),
        sa.Column('book_name', sa.String(200), nullable=False),
        sa.Column('book_author', sa.String(20), nullable=False),
        sa.Column('book_rating', sa.Integer(), nullable=False, server_default='1')  # Ensuring default value of 1
    )

    # Copy data from old table to new table with a default rating of 1
    op.execute(
        "INSERT INTO books_new (book_id, book_name, book_author, book_rating) "
        "SELECT book_id, book_name, book_author, 1 FROM books"
    )
    # Drop the old table
    op.drop_table('books')

    # Rename the new table to books
    op.rename_table('books_new', 'books')


def downgrade():
    # Create old table structure without rating
    op.create_table(
        'books_old',
        sa.Column('book_id', sa.Integer(), primary_key=True),
        sa.Column('book_name', sa.String(200), nullable=False),
        sa.Column('book_author', sa.String(20), nullable=False)
    )

    # Copy data from new table to old table (excluding rating)
    op.execute(
        "INSERT INTO books_old (book_id, book_name, book_author) "
        "SELECT book_id, book_name, book_author FROM books"
    )

    # Drop the new table
    op.drop_table('books')

    # Rename the old table back to books
    op.rename_table('books_old', 'books')