from datetime import date
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models import Patient, DischargeSummary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class PatientCreate(BaseModel):
    name: str
    age: int | None = None
    gender: str | None = None
    admission_date: date | None = None
    discharge_date: date | None = None
    diagnosis: str | None = None


class SummaryCreate(BaseModel):
    patient_id: int
    summary_text: str | None = None
    medications: str | None = None
    follow_up_instructions: str | None = None


@app.get("/")
def home():
    return {"message": "Hospital Discharge Assistant API running"}


@app.get("/patients")
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()


@app.post("/patients")
def add_patient(data: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(**data.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@app.post("/discharge-summaries")
def add_summary(data: SummaryCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    summary = DischargeSummary(**data.model_dump())
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary


@app.get("/patients/{patient_id}/summaries")
def get_summaries(patient_id: int, db: Session = Depends(get_db)):
    return db.query(DischargeSummary).filter(
        DischargeSummary.patient_id == patient_id
    ).all()