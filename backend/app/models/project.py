# app/models/project.py
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    estimated_time = Column(Integer, nullable=False)  # en días
    price = Column(Float, nullable=False)
    type = Column(String, nullable=False)  # 'gestion' o 'multimedia'

    # Multimedia
    is_flash = Column(Boolean, nullable=True)
    is_director = Column(Boolean, nullable=True)

    # Gestión empresarial
    db_type = Column(String, nullable=True)
    language = Column(String, nullable=True)
    framework = Column(String, nullable=True)  # CodeIgniter, Symfony, etc.

    team = relationship("Team", back_populates="project", uselist=False)
