from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.team import TeamCreate, TeamOut
from app.crud import team as crud_team
from app.core.database import get_db

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.post("/", response_model=TeamOut)
def create_team(team: TeamCreate, db: Session = Depends(get_db)):
    try:
        return crud_team.create_team(db, team)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[TeamOut])
def get_teams(db: Session = Depends(get_db)):
    return crud_team.get_all_teams(db)
