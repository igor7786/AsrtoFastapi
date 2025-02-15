from pathlib import Path
from typing_extensions import Annotated
import io
from PIL import Image

from sqlmodel import SQLModel, Field, create_engine, Session, select, Relationship
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, File, Form, UploadFile, Response
from fastapi import Path as FastApiPath
from fastapi.params import Body, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from pydantic import BaseModel, ConfigDict, ValidationError, EmailStr, field_validator
from pydantic_core import ErrorDetails, PydanticCustomError
from pydantic_core.core_schema import FieldValidationInfo
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
from typing import Any, AsyncGenerator, List, Optional
import json
import base64
from google.genai.types import Tool, GenerateContentConfig, GoogleSearch, Part
from google import genai
from typing import Generator

# ! absolute path
APP_PATH = f'{str(Path(__file__).parent.parent.parent.resolve())}/'
# ! load variables from .env
load_dotenv(dotenv_path=f'{APP_PATH}.env')

# ? ####  ENVIRONMENT VARIABLES ####
db_url = env_vars.get('SQLITE_PATH')
db_alembic_url = env_vars.get('SQLMODEL_MIGRATE_PTH')
api_ai_key_gemma = env_vars.get('API_AI_KEY_GEMMA')
api_ai_base_gemma = env_vars.get('API_AI_BASE_GEMMA')
api_ai_model_gemma = env_vars.get('API_AI_MODEL_GEMMA')
api_ai_key_hf = env_vars.get('API_AI_KEY_HF')
api_ai_base_hf = env_vars.get('API_AI_BASE_HF')
api_ai_model_hf = env_vars.get('API_AI_MODEL_HF')
api_ai_key_gemmini = env_vars.get('API_AI_KEY_GEMMINI')
api_ai_model_gemmini = env_vars.get('API_AI_MODEL_GEMMINI')
api_ai_model_qwen = env_vars.get('API_AI_MODEL_QWEN')
api_ai_key_qwen = env_vars.get('API_AI_KEY_QWEN')
api_ai_base_qwen = env_vars.get('API_AI_BASE_QWEN')

__all__ = [

	'FastAPI', 'APIRouter', 'Depends', 'HTTPException', 'Request', 'File', 'Form', 'UploadFile', 'Body', 'Query',
	'FastApiPath',
	'Response', 'jsonable_encoder',
	'uvicorn',
	'CORSMiddleware',
	'datetime', 'timedelta',
	'BaseModel', 'ConfigDict', 'EmailStr', 'ValidationError', 'field_validator',
	'Field', 'Session', 'create_engine', 'SQLModel', 'select','Relationship',
	'AsyncSession',
	'create_async_engine',
	'PydanticCustomError', 'ErrorDetails', 'FieldValidationInfo',
	'JSONResponse',
	'logging',
	'colorlog',
	'AsyncOpenAI', 'OpenAIError', 'openai', 'Tool', 'GenerateContentConfig', 'GoogleSearch', 'Part', 'genai',
	'StreamingResponse',
	'db_url',
	'db_alembic_url',
	'install',
	'api_ai_base_gemma', 'api_ai_key_gemma', 'api_ai_model_gemma', 'api_ai_model_gemmini', 'api_ai_key_gemmini',
	'api_ai_key_qwen', 'api_ai_model_qwen', 'api_ai_base_qwen',
	'Any', 'AsyncGenerator', 'List', 'Optional',
	'Annotated',
	'json',
	'base64',
	'Generator',
	'io',
	'Image',

]
