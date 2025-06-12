from pydantic import BaseModel
from typing import List, Optional

# ────── Base ──────
class WorkerBase(BaseModel):
    name: str
    age: int
    gender: str
    base_salary: float

# ────── Output común ──────
class WorkerOut(WorkerBase):
    id: int
    type: str

    class Config:
        orm_mode = True

# ────── Lenguaje ──────
class LanguageSchema(BaseModel):
    name: str

    class Config:
        orm_mode = True

# ────── Programador ──────
class ProgrammerCreate(WorkerBase):
    category: str
    languages: List[str]  # Lista de nombres de lenguajes

class ProgrammerOut(WorkerOut):
    category: str
    languages: List[LanguageSchema]
    team_id: Optional[int]

# ────── Líder ──────
class LeaderCreate(WorkerBase):
    experience_years: int
    directed_projects: int

class LeaderOut(WorkerOut):
    experience_years: int
    directed_projects: int
    team_id: Optional[int] = None  # Añadir valor por defecto None

class LeaderResponse(BaseModel):
    id: int
    name: str
    age: int
    gender: str
    base_salary: float
    experience_years: int
    directed_projects: int
    team_id: Optional[int] = None  # Hacer optional con valor por defecto None
    
    class Config:
        orm_mode = True  # o from_attributes = True en Pydantic v2
