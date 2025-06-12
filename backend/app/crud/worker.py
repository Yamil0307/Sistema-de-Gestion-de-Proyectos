from sqlalchemy.orm import Session
from app.models.worker import Programmer, Leader, Language
from app.schemas.worker import ProgrammerCreate, LeaderCreate

# ─── Crear Programador ───
def create_programmer(db: Session, programmer: ProgrammerCreate):
    db_programmer = Programmer(
        name=programmer.name,
        age=programmer.age,
        gender=programmer.gender,
        base_salary=programmer.base_salary,
        category=programmer.category
    )

    db_languages = []
    for lang in programmer.languages:
        db_lang = db.query(Language).filter(Language.name == lang).first()
        if not db_lang:
            db_lang = Language(name=lang)
        db_languages.append(db_lang)

    db_programmer.languages = db_languages
    db.add(db_programmer)
    db.commit()
    db.refresh(db_programmer)
    return db_programmer

# ─── Crear Líder ───
def create_leader(db: Session, leader: LeaderCreate):
    db_leader = Leader(
        name=leader.name,
        age=leader.age,
        gender=leader.gender,
        base_salary=leader.base_salary,
        experience_years=leader.experience_years,
        directed_projects=leader.directed_projects
    )
    db.add(db_leader)
    db.commit()
    db.refresh(db_leader)
    return db_leader

# ─── Obtener todos ───
def get_all_programmers(db: Session):
    return db.query(Programmer).all()

def get_all_leaders(db: Session):
    return db.query(Leader).all()

# ─── Obtener por ID ───
def get_worker_by_id(db: Session, worker_id: int):
    return db.query(Programmer).filter_by(id=worker_id).first() or db.query(Leader).filter_by(id=worker_id).first()
