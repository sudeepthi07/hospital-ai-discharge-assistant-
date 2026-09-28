from datetime import date
from database import SessionLocal
from models import Patient

db = SessionLocal()

patient = Patient(
    name="Test Patient",
    age=45,
    gender="Female",
    admission_date=date(2026, 9, 20),
    discharge_date=date(2026, 9, 27),
    diagnosis="Typhoid fever",
)
db.add(patient)
db.commit()
db.refresh(patient)
print("Saved patient with id:", patient.id)

all_patients = db.query(Patient).all()
print("Total patients in DB:", len(all_patients))

db.close()