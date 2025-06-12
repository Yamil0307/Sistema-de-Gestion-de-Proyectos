from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr
    is_active: Optional[bool] = True
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    
    class Config:
        orm_mode = True

class UserInDB(UserOut):
    hashed_password: str

# Esquemas para autenticación
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None