# server.py
from fastmcp import FastMCP
import json

mcp = FastMCP("Demo 🚀")

@mcp.tool()
def add(a: int, b: int) -> str:
    """Add two numbers"""
    c = a + b
    dict_to_json = {"Answer": c}
    return json.dumps(dict_to_json)

if __name__ == "__main__":
    mcp.run(transport="sse", host="0.0.0.0", port=8080)