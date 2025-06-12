from fastapi import FastAPI
from app.routers import worker, project, team, logic, auth  # Añadir auth aquí
from app.core.database import create_tables

app = FastAPI(title="Proyecto 43 - Empresa de Software")

create_tables()

app.include_router(auth.router)
app.include_router(worker.router)
app.include_router(project.router)
app.include_router(team.router)
app.include_router(logic.router)
