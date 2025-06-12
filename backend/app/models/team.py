# app/models/team.py
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("projects.id"), unique=True)
    leader_id = Column(Integer, ForeignKey("leaders.id"), unique=True)

    project = relationship("Project", back_populates="team")
    leader = relationship("Leader", back_populates="team")
    programmers = relationship("Programmer", back_populates="team")
