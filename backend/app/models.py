from sqlalchemy import Column, Integer, String, Float, Tuple
from sqlalchemy.dialects.postgresql import ARRAY

from .database import Base
from geoalchemy2 import Geometry


# -------------- SQL Table Structure -------------- #

class Polygon(Base):
    __tablename__ = "polygons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String, index=True)
    type = Column(String, index=True)
    coordinates = Column(Geometry('POLYGON'))

    # coordinates = Column(String)  # Storing as JSON string
    # coordinates = Column(ARRAY(POINT))  # Storing as points[]
    # coordinates = Column(ARRAY(Geometry('POINT')))
    # coordinates = Column(ARRAY(Tuple(Float, Float)))

