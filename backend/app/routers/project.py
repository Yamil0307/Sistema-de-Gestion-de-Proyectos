from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.project import ProjectCreate, ProjectOut
from app.crud import project as crud_project
from app.core.database import get_db

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectOut)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return crud_project.create_project(db, project)

@router.get("/", response_model=list[ProjectOut])
def get_all_projects(db: Session = Depends(get_db)):
    return crud_project.get_all_projects(db)
