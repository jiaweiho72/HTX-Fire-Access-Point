from fastapi import FastAPI
from .api.endpoints import polygons
from .database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Set root path TBC
app = FastAPI()

# Allow all origins (not recommended for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(polygons.router, prefix="/polygons", tags=["polygons"])
