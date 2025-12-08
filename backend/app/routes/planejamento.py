from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, Query

from app.core.security import verify_token
from app.schemas.planejamento import PlanejamentoCreate, PlanejamentoListResponse, PlanejamentoRecord
from app.services import google_sheets

router = APIRouter()


@router.post("/planejamento", response_model=PlanejamentoRecord, status_code=201)
async def create_planejamento(payload: PlanejamentoCreate) -> PlanejamentoRecord:
    """Recebe um registro de planejamento e grava na planilha."""
    return google_sheets.append_registro(payload)


@router.get("/planejamento", response_model=PlanejamentoListResponse)
async def list_planejamentos(
    funcao: Optional[str] = None,
    tempo_empresa: Optional[str] = None,
    start_date: Optional[str] = Query(None, description="Filtrar timestamp inicial (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filtrar timestamp final (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Busca textual em campos SWOT"),
    _: str = Depends(verify_token),
) -> PlanejamentoListResponse:
    registros = google_sheets.list_registros()

    def in_date_range(record: PlanejamentoRecord) -> bool:
        if start_date:
            if record.timestamp.date() < datetime.fromisoformat(start_date).date():
                return False
        if end_date:
            if record.timestamp.date() > datetime.fromisoformat(end_date).date():
                return False
        return True

    filtered: List[PlanejamentoRecord] = []
    for r in registros:
        if funcao and r.funcao.lower() != funcao.lower():
            continue
        if tempo_empresa and tempo_empresa.lower() not in r.tempo_empresa.lower():
            continue
        if search:
            blob = " ".join([r.forcas, r.fraquezas, r.oportunidades, r.ameacas]).lower()
            if search.lower() not in blob:
                continue
        if not in_date_range(r):
            continue
        filtered.append(r)

    return PlanejamentoListResponse(total=len(filtered), items=filtered)
