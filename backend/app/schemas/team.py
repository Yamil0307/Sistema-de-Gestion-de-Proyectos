from pydantic import BaseModel
from typing import List, Optional
from app.schemas.worker import ProgrammerOut, LeaderOut
from app.schemas.project import ProjectOut

class TeamBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    lider_id: Optional[int] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    lider_id: Optional[int] = None

class TeamOut(TeamBase):
    id: int
    leader: Optional[LeaderOut]
    programmers: List[ProgrammerOut]
    project: Optional[ProjectOut]

    class Config:
        from_attributes = True
