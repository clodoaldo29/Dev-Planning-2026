from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import auth, planejamento

settings = get_settings()

app = FastAPI(title="Planejamento Estratégico 2026", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.auth_prefix, tags=["Auth"])
app.include_router(planejamento.router, prefix=settings.api_prefix, tags=["Planejamento"])


@app.get("/health")
async def health_check():
    return {"status": "ok"}
