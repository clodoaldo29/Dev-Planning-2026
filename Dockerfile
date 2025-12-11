# ===============================
# 1. Construção do FRONTEND (React + Vite)
# ===============================
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

# Copia apenas os arquivos necessários para instalar dependências
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copia resto do código e builda
COPY frontend/ ./
RUN npm run build


# ===============================
# 2. Construção do BACKEND (Python + FastAPI)
# ===============================
FROM python:3.11-slim AS backend

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copia o backend
COPY backend/ ./backend/

# Instala libs do backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o frontend buildado para dentro do backend (para servir pelo FastAPI)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expor a porta usada pelo FastAPI
EXPOSE 8000

# Comando final de execução
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
