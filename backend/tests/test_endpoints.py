import pytest
import httpx
import asyncio
from typing import Dict, Any
import uuid

# Base URL for the API
BASE_URL = "http://localhost:8080"

# Test user credentials
from datetime import datetime, timedelta

TEST_USER = {
    "username": "testuser",
    "password": "testpassword123",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "is_active": True,
    "role": "user",
    "dob": (datetime.now() - timedelta(days=365 * 20)).strftime("%d-%m-%Y")  # 20 years old
}

# Test book data
TEST_BOOK = {
    "name": "Test Book",
    "genre": "Test",
    "rating": 5
}

# Global variables to store auth token and created book ID
auth_token = None
created_book_id = None

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.mark.asyncio
async def test_health_check():
    """Test the health check endpoint."""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/api/v1/test/")
        assert response.status_code == 200
        assert "http" in response.json()

@pytest.mark.asyncio
async def test_create_user():
    """Test user creation."""
    global auth_token
    
    # Create a unique username for testing
    test_user = TEST_USER.copy()
    test_user["username"] = f"testuser_{uuid.uuid4().hex[:8]}"
    test_user["email"] = f"{test_user['username']}@example.com"
    
    async with httpx.AsyncClient() as client:
        # Test user creation
        response = await client.post(
            f"{BASE_URL}/api/v1/auth/create-user",
            json={
                "user_name": test_user["username"],
                "email": test_user["email"],
                "first_name": test_user["first_name"],
                "last_name": test_user["last_name"],
                "is_active": test_user["is_active"],
                "role": test_user["role"],
                "hashed_password": test_user["password"],
                "dob": test_user["dob"]
            }
        )
        assert response.status_code == 201
        
        # Test login
        login_response = await client.post(
            f"{BASE_URL}/api/v1/auth/token",
            data={
                "username": test_user["username"],
                "password": test_user["password"],
                "grant_type": "password"
            }
        )
        assert login_response.status_code == 201
        auth_data = login_response.json()
        assert "access_token" in auth_data
        assert "token_type" in auth_data
        
        # Store the token for other tests
        auth_token = f"{auth_data['token_type']} {auth_data['access_token']}"

@pytest.mark.asyncio
async def test_books_endpoints():
    """Test book-related endpoints."""
    global created_book_id
    
    if not auth_token:
        pytest.skip("Authentication token not available")
    
    headers = {"Authorization": auth_token}
    
    async with httpx.AsyncClient() as client:
        # Test creating a book
        create_response = await client.post(
            f"{BASE_URL}/api/v1/books-store/book",
            json=TEST_BOOK,
            headers=headers
        )
        assert create_response.status_code == 201
        book_data = create_response.json()
        assert "createdBook" in book_data
        assert book_data["createdBook"] == "success"
        
        # Get the book ID from the list of all books
        get_response = await client.get(
            f"{BASE_URL}/api/v1/books-store/books",
            headers=headers
        )
        assert get_response.status_code == 200
        response_data = get_response.json()
        assert "allBooks" in response_data
        assert isinstance(response_data["allBooks"], list)
        assert len(response_data["allBooks"]) > 0
        created_book_id = response_data["allBooks"][0]["id"]
        
        # Test getting all books
        get_response = await client.get(
            f"{BASE_URL}/api/v1/books-store/books",
            headers=headers
        )
        assert get_response.status_code == 200
        response_data = get_response.json()
        assert "allBooks" in response_data
        assert isinstance(response_data["allBooks"], list)
        
        # Test getting a single book
        book_response = await client.get(
            f"{BASE_URL}/api/v1/books-store/book?q={TEST_BOOK['name']}",
            headers=headers
        )
        assert book_response.status_code == 200
        
        # Test updating the book name
        update_data = {"upd_book_name": "Updated Test Book"}
        update_response = await client.put(
            f"{BASE_URL}/api/v1/books-store/book-name/{created_book_id}",
            json=update_data,
            headers=headers
        )
        assert update_response.status_code == 204
        
        # Test updating the entire book
        update_full_data = {"name": "Updated Test Book", "genre": "Updated", "rating": 4}
        update_full_response = await client.put(
            f"{BASE_URL}/api/v1/books-store/book/{created_book_id}",
            json=update_full_data,
            headers=headers
        )
        assert update_full_response.status_code == 204
        
        # Test deleting the book
        delete_response = await client.delete(
            f"{BASE_URL}/api/v1/books-store/book/{created_book_id}",
            headers=headers
        )
        assert delete_response.status_code == 204

@pytest.mark.asyncio
async def test_ai_endpoints():
    """Test AI-related endpoints."""
    if not auth_token:
        pytest.skip("Authentication token not available")
    
    headers = {"Authorization": auth_token}
    
    async with httpx.AsyncClient() as client:
        # Test text generation
        response = await client.post(
            f"{BASE_URL}/api/stream/v1/AI/generate-gemma",
            data={"prompt": "Tell me a short story about programming"},
            headers=headers
        )
        assert response.status_code == 200
        assert len(response.text) > 0

if __name__ == "__main__":
    import sys
    import pytest
    sys.exit(pytest.main(["-v"]))
