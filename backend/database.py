import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
password = quote_plus(DB_PASSWORD)
DATABASE_URL = (
    f"postgresql+psycopg2://postgres:{password}@localhost:5432/hospital_discharge_db"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()