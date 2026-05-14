from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import auth_router
from app.database import Base, engine
from app.routes.clients import router as clients_router
from app.routes.dashboard import router as dashboard_router
from app.routes.invoices import router as invoices_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Orivah API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Orivah backend is running"}


app.include_router(auth_router)
app.include_router(clients_router)
app.include_router(invoices_router)
app.include_router(dashboard_router)
