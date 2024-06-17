from pydantic import BaseModel
from pydantic.class_validators import validator
from typing import Optional

class AuthRequestDTO(BaseModel):
    email: Optional[str]
    password: Optional[str]
    idToken: Optional[str]
    name: Optional[str]