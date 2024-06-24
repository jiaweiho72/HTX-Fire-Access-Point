import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# SQLALCHEMY_DATABASE_URL = 'postgresql://guest2:90108501@localhost:5432/map'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

