# app/models/worker.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.core.database import Base

class ProgrammerLanguage(Base):
    __tablename__ = "programmer_language"
    
    programmer_id = Column(Integer, ForeignKey("programmers.id"), primary_key=True)
    language_id = Column(Integer, ForeignKey("languages.id"), primary_key=True)

class Worker(Base):
    __tablename__ = "workers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    base_salary = Column(Float, nullable=False)
    type = Column(String)  # 'programmer' o 'leader'

    __mapper_args__ = {
        "polymorphic_identity": "worker",
        "polymorphic_on": type,
    }

class Programmer(Worker):
    __tablename__ = "programmers"
    id = Column(Integer, ForeignKey("workers.id"), primary_key=True)
    category = Column(String, nullable=False)  # A, B o C
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    languages = relationship(
        "Language",
        secondary="programmer_language",
        back_populates="programmers"
    )

    team = relationship("Team", back_populates="programmers")

    __mapper_args__ = {
        "polymorphic_identity": "programmer",
    }

class Leader(Worker):
    __tablename__ = "leaders"
    id = Column(Integer, ForeignKey("workers.id"), primary_key=True)
    experience_years = Column(Integer, nullable=False)
    directed_projects = Column(Integer, nullable=False)

    team = relationship("Team", back_populates="leader", uselist=False)

    __mapper_args__ = {
        "polymorphic_identity": "leader",
    }

class Language(Base):
    __tablename__ = "languages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

    programmers = relationship(
        "Programmer",
        secondary="programmer_language",
        back_populates="languages"
    )
