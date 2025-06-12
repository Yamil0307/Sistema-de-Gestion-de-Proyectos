from pydantic import BaseModel
from typing import Optional

class ProjectBase(BaseModel):
    name: str
    description: Optional[str]
    estimated_time: int
    price: float
    type: str  # 'gestion' o 'multimedia'

# Para proyectos de gestión
class ProjectGestionInfo(BaseModel):
    db_type: str
    language: str
    framework: str

# Para proyectos multimedia
class ProjectMultimediaInfo(BaseModel):
    is_flash: bool
    is_director: bool

class ProjectCreate(ProjectBase):
    db_type: Optional[str] = None
    language: Optional[str] = None
    framework: Optional[str] = None
    is_flash: Optional[bool] = None
    is_director: Optional[bool] = None

class ProjectOut(ProjectCreate):
    id: int

    class Config:
        orm_mode = True
