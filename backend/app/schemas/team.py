from pydantic import BaseModel
from typing import List, Optional
from app.schemas.worker import ProgrammerOut, LeaderOut
from app.schemas.project import ProjectOut

class TeamBase(BaseModel):
    pass  # De momento no tiene campos en la creación

class TeamCreate(BaseModel):
    leader_id: int
    programmer_ids: List[int]
    project_id: int

class TeamOut(BaseModel):
    id: int
    leader: Optional[LeaderOut]
    programmers: List[ProgrammerOut]
    project: Optional[ProjectOut]

    class Config:
        orm_mode = True
