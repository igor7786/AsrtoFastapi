# server.py
from fastmcp import FastMCP
import json

mcp = FastMCP("Demo 🚀")

@mcp.tool()
def add(a: int, b: int) -> str:
    """
    Add two numbers.

    This function takes two integer arguments, 'a' and 'b', adds them together,
    and returns the result as a JSON-formatted string with the key "Answer".
    """
    c = a + b
    dict_to_json = {"Answer": c}
    return json.dumps(dict_to_json)

@mcp.tool()
def subtract(a: int, b: int) -> str:
    """
    Subtract two numbers.

    This function takes two integer arguments, 'a' and 'b', subtracts 'b' from 'a',
    and returns the result as a JSON-formatted string with the key "Answer".
    """
    c = a - b
    dict_to_json = {"Answer": c}
    return json.dumps(dict_to_json)

@mcp.tool()
def multiply(a: int, b: int) -> str:
    """Multiply two numbers"""
    c = a * b
    dict_to_json = {"Answer": c}
    return json.dumps(dict_to_json)

@mcp.tool()
def divide(a: int, b: int) -> str:
    """Divide two numbers"""
    c = a / b
    dict_to_json = {"Answer": c}
    return json.dumps(dict_to_json)

@mcp.tool()
def power(a: int, b: int) -> str:
    """Raise a number to a power"""
    c = a ** b
    dict_to_json = {"Answer": c}
    return json.dumps(dict_to_json)

@mcp.tool()
def square_root(a: int) -> str:
    """Calculate the square root of a number"""
    c = a ** 0.5
    dict_to_json = {"Answer": c}
    return json.dumps(dict_to_json)

@mcp.tool()
def factorial(n: int) -> str:
    """Calculate the factorial of a number"""
    if n == 0:
        return json.dumps({"Answer": 1})
    else:
        c = 1
        for i in range(1, n + 1):
            c *= i
        dict_to_json = {"Answer": c}
        return json.dumps(dict_to_json)

@mcp.tool()
def fibonacci(n: int) -> str:
    """Calculate the nth Fibonacci number"""
    if n <= 0:
        return json.dumps({"Answer": 0})
    elif n == 1:
        return json.dumps({"Answer": 1})
    else:
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        dict_to_json = {"Answer": b}
        return json.dumps(dict_to_json)

if __name__ == "__main__":
    mcp.run(transport="sse", host="0.0.0.0", port=8080)
