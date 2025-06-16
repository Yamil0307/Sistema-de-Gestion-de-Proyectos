from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import worker, project, team, logic, auth  # Añadir auth aquí
from app.core.database import create_tables

app = FastAPI(title="Proyecto 43 - Empresa de Software")

# Configurar CORS - Coloca esto ANTES de incluir los routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ajusta según la URL de tu frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Incluye OPTIONS explícitamente
    allow_headers=["*"],
)

create_tables()

# Aquí van tus inclusiones de routers
app.include_router(auth.router)
app.include_router(worker.router)
app.include_router(project.router)
app.include_router(team.router)
app.include_router(logic.router)
