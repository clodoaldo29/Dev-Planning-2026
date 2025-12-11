from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import get_settings
from app.routes import auth, planejamento

settings = get_settings()

app = FastAPI(title="Planejamento Estratégico 2026", version="1.0.0")

# Middleware de CORS (mantido)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # liberar todos os origins (DEV)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas de API (mantidas)
app.include_router(auth.router, prefix=settings.auth_prefix, tags=["Auth"])
app.include_router(planejamento.router, prefix=settings.api_prefix, tags=["Planejamento"])

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# ==========================
# Servir frontend buildado (Vite) via FastAPI
# ==========================
# Estrutura esperada:
# raiz do projeto/
#   backend/
#     app/
#       main.py  <-- este arquivo
#   frontend/
#     dist/     <-- gerado por `npm run build`
dist_path = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

# Somente monta se a pasta existir (assim não quebra ambiente de dev local)
if dist_path.exists():
    # html=True garante que index.html seja retornado para rotas SPA
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")