from sqlalchemy.orm import Session
from app.models.team import Team
from app.models.worker import Leader
from app.schemas.team import TeamCreate, TeamUpdate

def get_all_teams(db: Session):
    """Obtener todos los equipos"""
    return db.query(Team).all()

def get_team_by_id(db: Session, team_id: int):
    """Obtener un equipo por ID"""
    return db.query(Team).filter(Team.id == team_id).first()

def get_team_by_leader_id(db: Session, leader_id: int):
    """Obtener el equipo que tiene asignado un líder específico"""
    return db.query(Team).filter(Team.lider_id == leader_id).first()

def get_team_by_name(db: Session, name: str):
    """Obtener un equipo por nombre"""
    return db.query(Team).filter(Team.nombre.ilike(f"%{name}%")).first()

def create_team(db: Session, team: TeamCreate):
    """Crear un nuevo equipo"""
    
    # Verificar que no existe un equipo con el mismo nombre
    existing_team = db.query(Team).filter(Team.nombre == team.nombre).first()
    if existing_team:
        raise ValueError(f"Ya existe un equipo con el nombre '{team.nombre}'")
    
    # Verificar que el líder no esté ya asignado (si se proporciona)
    if team.lider_id:
        existing_team_with_leader = get_team_by_leader_id(db, team.lider_id)
        if existing_team_with_leader:
            raise ValueError(f"El líder ya está asignado al equipo '{existing_team_with_leader.nombre}'")
        
        # Verificar que el líder existe
        leader = db.query(Leader).filter(Leader.id == team.lider_id).first()
        if not leader:
            raise ValueError(f"No existe un líder con ID {team.lider_id}")
    
    # Crear el equipo
    db_team = Team(
        nombre=team.nombre,
        descripcion=team.descripcion if hasattr(team, 'descripcion') else None,
        lider_id=team.lider_id if team.lider_id else None
    )
    
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def update_team(db: Session, team_id: int, team: TeamUpdate):
    """Actualizar un equipo existente"""
    
    db_team = get_team_by_id(db, team_id)
    if not db_team:
        raise ValueError("Equipo no encontrado")
    
    # Verificar nombre único (si se está cambiando)
    if hasattr(team, 'nombre') and team.nombre and team.nombre != db_team.nombre:
        existing_team = db.query(Team).filter(Team.nombre == team.nombre).first()
        if existing_team:
            raise ValueError(f"Ya existe un equipo con el nombre '{team.nombre}'")
    
    # Verificar líder disponible (si se está cambiando)
    if hasattr(team, 'lider_id') and team.lider_id is not None and team.lider_id != db_team.lider_id:
        if team.lider_id != 0:  # 0 significa sin líder
            existing_team_with_leader = get_team_by_leader_id(db, team.lider_id)
            if existing_team_with_leader:
                raise ValueError(f"El líder ya está asignado al equipo '{existing_team_with_leader.nombre}'")
            
            # Verificar que el líder existe
            leader = db.query(Leader).filter(Leader.id == team.lider_id).first()
            if not leader:
                raise ValueError(f"No existe un líder con ID {team.lider_id}")
    
    # Actualizar campos
    if hasattr(team, 'nombre') and team.nombre is not None:
        db_team.nombre = team.nombre
    if hasattr(team, 'descripcion') and team.descripcion is not None:
        db_team.descripcion = team.descripcion
    if hasattr(team, 'lider_id') and team.lider_id is not None:
        db_team.lider_id = team.lider_id if team.lider_id != 0 else None
    
    db.commit()
    db.refresh(db_team)
    return db_team

def delete_team(db: Session, team_id: int):
    """Eliminar un equipo"""
    
    db_team = get_team_by_id(db, team_id)
    if not db_team:
        raise ValueError("Equipo no encontrado")
    
    db.delete(db_team)
    db.commit()
    return True
