from pydantic import BaseModel
from typing import List

class SalaryReport(BaseModel):
    worker_id: int
    name: str
    salary: float

class ProjectCountByType(BaseModel):
    gestion: int
    multimedia: int
