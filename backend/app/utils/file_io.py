import json
from app.models import Project, Team, Programmer, Leader
from sqlalchemy.orm import Session

def export_project(db: Session, project_id: int, filepath: str) -> bool:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return False

    team = project.team
    if not team:
        return False

    data = {
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "estimated_time": project.estimated_time,
            "price": project.price,
            "type": project.type,
            "is_flash": project.is_flash,
            "is_director": project.is_director,
            "db_type": project.db_type,
            "language": project.language,
            "framework": project.framework
        },
        "team": {
            "leader": {
                "id": team.leader.id,
                "name": team.leader.name,
                "age": team.leader.age,
                "gender": team.leader.gender,
                "base_salary": team.leader.base_salary,
                "experience_years": team.leader.experience_years,
                "projects_led": team.leader.projects_led
            },
            "programmers": [
                {
                    "id": p.id,
                    "name": p.name,
                    "age": p.age,
                    "gender": p.gender,
                    "base_salary": p.base_salary,
                    "languages": p.languages,
                    "category": p.category
                } for p in team.programmers
            ]
        }
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    
    return True

def import_project(db: Session, filepath: str) -> Project:
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    p_data = data["project"]
    t_data = data["team"]

    # Crear proyecto
    project = Project(**p_data)
    db.add(project)
    db.commit()
    db.refresh(project)

    # Crear líder
    leader_data = t_data["leader"]
    leader = Leader(**leader_data)
    db.add(leader)
    db.commit()
    db.refresh(leader)

    # Crear programadores
    programmers = []
    for p in t_data["programmers"]:
        prog = Programmer(**p)
        db.add(prog)
        db.commit()
        db.refresh(prog)
        programmers.append(prog)

    # Crear equipo
    from app.models import Team
    team = Team(project_id=project.id, leader_id=leader.id)
    db.add(team)
    db.commit()
    db.refresh(team)

    for prog in programmers:
        prog.team_id = team.id
        db.add(prog)

    db.commit()
    return project
