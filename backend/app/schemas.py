from pydantic import BaseModel
from typing import List, Tuple, Optional

# -------------- Pydantic models for type validation -------------- #

class PolygonBase(BaseModel):
    name: Optional[str]
    address: Optional[str]
    type: Optional[str]
    coordinates: List[List[float]]
    # coordinates: Optional[str]
    # coordinates: List[Tuple[float, float]]

class PolygonCreate(PolygonBase):
    pass

class PolygonUpdate(PolygonBase):
    pass

class Polygon(PolygonBase):
    id: int

    class Config:
        orm_mode = True
