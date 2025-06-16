from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.worker import *
from app.core.database import get_db
from app.crud import worker as crud_worker
from app.core.deps import get_current_active_user, get_current_admin_user
from app.models.user import User

router = APIRouter(prefix="/workers", tags=["Workers"])

@router.post("/programmers", response_model=ProgrammerOut)
def create_programmer(
    programmer: ProgrammerCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud_worker.create_programmer(db, programmer)

@router.post("/leaders", response_model=LeaderResponse)
def create_leader(leader: LeaderCreate, db: Session = Depends(get_db)):
    db_leader = crud_worker.create_leader(db, leader)
    return {
        "id": db_leader.id,
        "name": db_leader.name,
        "age": db_leader.age,
        "gender": db_leader.gender,
        "base_salary": db_leader.base_salary,
        "experience_years": db_leader.experience_years,
        "directed_projects": db_leader.directed_projects,
        "team_id": None
    }

@router.get("/programmers", response_model=list[ProgrammerOut])
def list_programmers(db: Session = Depends(get_db)):
    return crud_worker.get_all_programmers(db)

@router.get("/leaders", response_model=list[LeaderOut])
def list_leaders(db: Session = Depends(get_db)):
    return crud_worker.get_all_leaders(db)

# ========== NUEVOS ENDPOINTS DELETE ==========

@router.delete("/programmers/{programmer_id}")
def delete_programmer(
    programmer_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Eliminar un programador por ID"""
    programmer = crud_worker.get_programmer_by_id(db, programmer_id)
    if not programmer:
        raise HTTPException(status_code=404, detail="Programador no encontrado")
    
    crud_worker.delete_programmer(db, programmer_id)
    return {"message": f"Programador con ID {programmer_id} eliminado exitosamente"}

@router.delete("/leaders/{leader_id}")
def delete_leader(
    leader_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Eliminar un líder por ID"""
    leader = crud_worker.get_leader_by_id(db, leader_id)
    if not leader:
        raise HTTPException(status_code=404, detail="Líder no encontrado")
    
    crud_worker.delete_leader(db, leader_id)
    return {"message": f"Líder con ID {leader_id} eliminado exitosamente"}
