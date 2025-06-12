from app.models.project import Project
from app.models.worker import Worker, Programmer, Leader 

def count_projects_by_type(db):
    gestion = db.query(Project).filter(Project.type == "gestion").count()
    multimedia = db.query(Project).filter(Project.type == "multimedia").count()
    return {"gestion": gestion, "multimedia": multimedia}

def get_earliest_project(db):
    return db.query(Project).order_by(Project.estimated_time).first()

def calculate_total_payroll(db):
    total = 0
    workers = db.query(Worker).all()
    for w in workers:
        if isinstance(w, Programmer):
            if w.team and w.team.project:
                bonus = 0.05 * w.team.project.price + 3 * len(w.languages)
                total += w.base_salary + bonus
            else:
                total += w.base_salary
        elif isinstance(w, Leader):
            if w.team and w.team.project:
                bonus = 0.10 * w.team.project.price + 5 * w.experience_years
                total += w.base_salary + bonus
            else:
                total += w.base_salary
    return total

def get_highest_paid_workers(db):
    workers = db.query(Worker).all()
    salaries = []

    for w in workers:
        salary = w.base_salary
        if isinstance(w, Programmer) and w.team and w.team.project:
            salary += 0.05 * w.team.project.price + 3 * len(w.languages)
        elif isinstance(w, Leader) and w.team and w.team.project:
            salary += 0.10 * w.team.project.price + 5 * w.experience_years
        salaries.append((w, salary))
    
    if not salaries:
        return []

    max_salary = max(salaries, key=lambda x: x[1])[1]
    return [{"worker": w, "salary": s} for w, s in salaries if s == max_salary]

def get_project_by_programmer_id(db, programmer_id: int):
    prog = db.query(Programmer).filter(Programmer.id == programmer_id).first()
    if not prog or not prog.team or not prog.team.project:
        return None
    return prog.team.project

def get_programmers_by_project_id(db, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project or not project.team:
        return []
    return project.team.programmers

def get_programmers_by_framework(db, framework: str):
    projects = db.query(Project).filter(
        Project.type == "gestion", Project.framework == framework
    ).all()

    programmers = []
    for p in projects:
        if p.team:
            programmers.extend(p.team.programmers)

    return programmers

import json

def export_project_to_file(db, project_id: int, filepath: str):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
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
        }
    }

    with open(filepath, "w") as f:
        json.dump(data, f, indent=4)

    return True

def import_project_from_file(db, filepath: str):
    with open(filepath, "r") as f:
        data = json.load(f)

    project_data = data["project"]
    project = Project(**project_data)
    db.add(project)
    db.commit()
    return project

