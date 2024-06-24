from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import crud, schemas
from ...database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Polygon])
def get_polygons(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_polygons(db=db, skip=skip, limit=limit)

@router.post("/createPolygon", response_model=schemas.Polygon)
def create_polygon(polygon: schemas.PolygonCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_polygon(db=db, polygon=polygon)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/updatePolygon/{polygon_id}", response_model=schemas.Polygon)
def update_polygon(polygon_id: int, polygon: schemas.PolygonUpdate, db: Session = Depends(get_db)):
    try:
        return crud.update_polygon(db=db, polygon_id=polygon_id, polygon=polygon)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.delete("/deletePolygon/{polygon_id}", response_model=schemas.Polygon)
def delete_polygon(polygon_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_polygon(db=db, polygon_id=polygon_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
