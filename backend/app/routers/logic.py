from fastapi import APIRouter, Depends, HTTPException  
from sqlalchemy.orm import Session
from app.services import logic
from app.core.database import get_db
from app.utils import file_io
from fastapi import UploadFile, File
import os
import csv

router = APIRouter(prefix="/logic", tags=["Business Logic"])

@router.get("/project-count")
def project_count(db: Session = Depends(get_db)):
    return logic.count_projects_by_type(db)

@router.get("/earliest-project")
def earliest_project(db: Session = Depends(get_db)):
    return logic.get_earliest_project(db)

@router.get("/payroll-total")
def payroll_total(db: Session = Depends(get_db)):
    return {"total": logic.calculate_total_payroll(db)}

@router.get("/top-earners")
def top_earners(db: Session = Depends(get_db)):
    return logic.get_highest_paid_workers(db)

@router.get("/programmer-project/{programmer_id}")
def programmer_project(programmer_id: int, db: Session = Depends(get_db)):
    return logic.get_project_by_programmer_id(db, programmer_id)

@router.get("/project-programmers/{project_id}")
def project_programmers(project_id: int, db: Session = Depends(get_db)):
    return logic.get_programmers_by_project_id(db, project_id)

@router.get("/framework-programmers/{framework}")
def framework_programmers(framework: str, db: Session = Depends(get_db)):
    return logic.get_programmers_by_framework(db, framework)

@router.get("/export-project/{project_id}")
def export_project(project_id: int, db: Session = Depends(get_db)):
    filepath = f"project_{project_id}.json"
    success = file_io.export_project(db, project_id, filepath)
    if not success:
        raise HTTPException(status_code=404, detail="Proyecto o equipo no encontrado.")
    return {"message": "Proyecto exportado exitosamente", "file": filepath}

@router.post("/import-project")
def import_project_from_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = file.file.read()
    filepath = f"/tmp/{file.filename}"
    with open(filepath, "wb") as f:
        f.write(contents)

    project = file_io.import_project(db, filepath)
    os.remove(filepath)
    return {"message": "Proyecto importado exitosamente", "project_id": project.id}