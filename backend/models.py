from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(50), nullable=True)
    diagnosis = Column(Text, nullable=True)
    admission_date = Column(Date, nullable=True)
    discharge_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    discharge_summaries = relationship("DischargeSummary", back_populates="patient")


class DischargeSummary(Base):
    __tablename__ = "discharge_summaries"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    summary_text = Column(Text)
    medications = Column(Text)
    follow_up_instructions = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    patient = relationship("Patient", back_populates="discharge_summaries")