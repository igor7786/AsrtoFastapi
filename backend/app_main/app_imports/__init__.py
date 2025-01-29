from pathlib import Path

from sqlmodel import SQLModel, Field, create_engine, Session
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel, ConfigDict, ValidationError, EmailStr, field_validator
from pydantic_core import ErrorDetails, PydanticCustomError
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
import logging
import colorlog
from openai import AsyncOpenAI, OpenAIError
import openai
from fastapi.responses import StreamingResponse
from os import environ as env_vars
from dotenv import load_dotenv
from rich.traceback import install
from typing import Any, AsyncGenerator
import json

# ! absolute path
APP_PATH = str(Path(__file__).parent.parent.parent.resolve()) + '/'
load_dotenv(dotenv_path=APP_PATH + '.env')
db_url = env_vars.get('SQLITE_PATH')
db_alembic_url = env_vars.get('SQLMODEL_MIGRATE_PTH')
api_ai_key_gemma = env_vars.get('API_AI_KEY_GEMMA')
api_ai_base_gemma = env_vars.get('API_AI_BASE_GEMMA')
api_ai_model_gemma = env_vars.get('API_AI_MODEL_GEMMA')
api_ai_key_hf = env_vars.get('API_AI_KEY_HF')
api_ai_base_hf = env_vars.get('API_AI_BASE_HF')
api_ai_model_hf = env_vars.get('API_AI_MODEL_HF')

__all__ = [
	'FastAPI',
	'uvicorn',
	'CORSMiddleware',
	'datetime',
	'BaseModel',
	'SQLModel',
	'create_engine',
	'Field',
	'Session',
	'Depends',
	'ValidationError',
	'AsyncSession',
	'create_async_engine',
	'ConfigDict',
	'HTTPException',
	'EmailStr',
	'PydanticCustomError',
	'ErrorDetails',
	'field_validator',
	'JSONResponse',
	'Request',
	'APIRouter',
	'logging',
	'colorlog',
	'AsyncOpenAI', 'OpenAIError', 'openai',
	'StreamingResponse',
	'db_url',
	'db_alembic_url',
	'install',
	'api_ai_base_gemma', 'api_ai_key_gemma', 'api_ai_model_gemma', 'api_ai_base_hf', 'api_ai_key_hf', 'api_ai_model_hf',
	'Any',
	'AsyncGenerator',
	'json'
]
