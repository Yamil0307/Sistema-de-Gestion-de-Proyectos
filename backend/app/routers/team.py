from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.crud import team as crud_team
from app.crud import worker as crud_worker
from app.schemas.team import *
from app.schemas.worker import LeaderOut
from app.core.deps import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("/available-leaders/", response_model=list[LeaderOut])
def get_available_leaders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Obtener todos los líderes que no están asignados a ningún equipo
    """
    try:
        # Obtener todos los líderes
        all_leaders = crud_worker.get_all_leaders(db)
        
        # Obtener todos los equipos con sus líderes asignados
        all_teams = crud_team.get_all_teams(db)
        
        # Extraer los IDs de líderes que ya están asignados
        assigned_leader_ids = {team.lider_id for team in all_teams if team.lider_id is not None}
        
        # Filtrar líderes disponibles (no asignados)
        available_leaders = [
            leader for leader in all_leaders 
            if leader.id not in assigned_leader_ids
        ]
        
        return available_leaders
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener líderes disponibles: {str(e)}"
        )

@router.get("/", response_model=list[TeamOut])
def get_all_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obtener todos los equipos"""
    return crud_team.get_all_teams(db)

@router.post("/", response_model=TeamOut)
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Crear un nuevo equipo"""
    
    # Validar que el líder no esté ya asignado a otro equipo
    if team.lider_id:
        existing_team = crud_team.get_team_by_leader_id(db, team.lider_id)
        if existing_team:
            raise HTTPException(
                status_code=400,
                detail=f"El líder ya está asignado al equipo '{existing_team.nombre}'"
            )
    
    return crud_team.create_team(db, team)

@router.put("/{team_id}", response_model=TeamOut)
def update_team(
    team_id: int,
    team: TeamUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Actualizar un equipo existente"""
    
    # Verificar que el equipo existe
    existing_team = crud_team.get_team_by_id(db, team_id)
    if not existing_team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    # Validar que el nuevo líder no esté ya asignado a otro equipo
    if team.lider_id and team.lider_id != existing_team.lider_id:
        team_with_leader = crud_team.get_team_by_leader_id(db, team.lider_id)
        if team_with_leader and team_with_leader.id != team_id:
            raise HTTPException(
                status_code=400,
                detail=f"El líder ya está asignado al equipo '{team_with_leader.nombre}'"
            )
    
    return crud_team.update_team(db, team_id, team)

@router.delete("/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Eliminar un equipo"""
    
    team = crud_team.get_team_by_id(db, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    crud_team.delete_team(db, team_id)
    return {"message": f"Equipo '{team.nombre}' eliminado exitosamente"}
