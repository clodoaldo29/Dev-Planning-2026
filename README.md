# Planejamento Estratégico 2026 – SWOT + Google Sheets

Aplicação completa (FastAPI + React) para coletar percepções SWOT do time de desenvolvimento e consolidar tudo em uma aba de uma planilha do Google Sheets. Inclui formulário público sem autenticação e painel administrativo com login simples.

## Visão Geral
- **Base de dados**: única fonte é a planilha Google Sheets, aba `Planejamento_2026`, com colunas `timestamp, nome, matricula, funcao, tempo_empresa, forcas, fraquezas, oportunidades, ameacas`.
- **Frontend**: React + Material UI + Vite, rotas `/` (formulário público), `/login` (login admin) e `/admin` (dashboard com filtros, exportação e gráfico).
- **Backend**: FastAPI, autenticação básica via usuário/senha definidos em variáveis de ambiente, integração direta com Google Sheets via Service Account.

## Pré-requisitos
- Python 3.10+
- Node.js 18+
- Credenciais de Service Account com acesso de edição à planilha alvo (arquivo `credentials.json`).
- ID da planilha do Google Sheets.

## Configuração do Backend
1. Crie o arquivo `backend/.env` a partir do modelo:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Ajuste valores:
   - `SPREADSHEET_ID`: ID da planilha.
   - `ADMIN_USER` / `ADMIN_PASSWORD`: credenciais de login do painel admin.
   - `SECRET_KEY`: chave para assinar JWT.
   - `GOOGLE_APPLICATION_CREDENTIALS`: caminho para `credentials.json` (padrão `./credentials.json`).

2. Posicione o arquivo `credentials.json` da Service Account no caminho configurado (ou mantenha no diretório `backend/`). Garanta que essa conta tenha permissão de edição na planilha.

3. Instale dependências e execute a API:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

### Endpoints principais
- `POST /api/planejamento`: cria um registro (público, sem token). Gera `timestamp` automático.
- `GET /api/planejamento`: lista registros com filtros (`funcao`, `tempo_empresa`, `start_date`, `end_date`, `search`). Requer header `Authorization: Bearer <token>`.
- `POST /auth/login`: retorna token JWT ao validar usuário/senha do admin.
- `GET /health`: verificação simples de saúde.

### Observações da integração com Google Sheets
- A aba usada é `Planejamento_2026`.
- A primeira linha da aba **precisa** conter exatamente os cabeçalhos na ordem esperada. O backend escreve usando range `A:I` mantendo essa ordem.
- O `timestamp` é preenchido no backend em UTC (`datetime.utcnow().isoformat()`).

## Configuração do Frontend
1. Crie o arquivo `frontend/.env` a partir do modelo:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   Ajuste `VITE_API_BASE_URL` para apontar para o backend (ex.: `http://localhost:8000`).

2. Instale dependências e rode o app:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Acesse:
   - Formulário público: `http://localhost:5173/`
   - Login admin: `http://localhost:5173/login`
   - Dashboard: `http://localhost:5173/admin` (exige token emitido no login)

### Funcionalidades do Dashboard
- Filtros por função, tempo de empresa, período e busca textual em campos SWOT.
- Cards de contagem e gráfico de barras (distribuição por função).
- Exportação dos dados visíveis em CSV ou JSON.

## Estrutura de Pastas
```
backend/
  app/
    core/           # configuração e segurança (JWT)
    routes/         # rotas FastAPI (auth, planejamento)
    schemas/        # modelos Pydantic
    services/       # integração com Google Sheets
  requirements.txt
  .env.example
frontend/
  src/
    pages/          # páginas públicas e admin
    components/     # layout e elementos reutilizáveis
    services/       # cliente Axios
  package.json
  vite.config.js
  .env.example
```

## Observações de Segurança
- As credenciais do administrador nunca são expostas no frontend; ficam somente nas variáveis de ambiente do backend.
- A Service Account deve ter permissões mínimas necessárias apenas para a planilha usada.

## Licença
Projeto interno para planejamento estratégico do time de desenvolvimento.
