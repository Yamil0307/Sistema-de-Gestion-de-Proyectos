from sqlalchemy.orm import Session
from app.models.team import Team
from app.models.worker import Leader, Programmer
from app.models.project import Project
from app.schemas.team import TeamCreate

def create_team(db: Session, team_data: TeamCreate):
    # Validar existencia
    leader = db.query(Leader).filter(Leader.id == team_data.leader_id).first()
    if not leader:
        raise ValueError("Leader not found")
    
    project = db.query(Project).filter(Project.id == team_data.project_id).first()
    if not project:
        raise ValueError("Project not found")
    
    team = Team(leader_id=leader.id, project_id=project.id)
    db.add(team)
    db.commit()
    db.refresh(team)

    for pid in team_data.programmer_ids:
        prog = db.query(Programmer).filter(Programmer.id == pid).first()
        if prog:
            prog.team_id = team.id
            db.add(prog)

    db.commit()
    return team

def get_all_teams(db: Session):
    return db.query(Team).all()

def get_team_by_id(db: Session, team_id: int):
    return db.query(Team).filter(Team.id == team_id).first()
