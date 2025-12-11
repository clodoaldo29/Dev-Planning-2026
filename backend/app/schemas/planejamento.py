from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


# Ordem das colunas da planilha do Google Sheets.
# Essa ordem deve bater com o cabeçalho da planilha.
PLANILHA_COLUMNS: List[str] = [
    "timestamp",
    "nome",
    "matricula",
    "funcao",
    "tempo_empresa",
    "forcas",
    "fraquezas",
    "oportunidades",
    "ameacas",
    "expectativas_2026",
    "contribuicao_2026",
]


class PlanejamentoCreate(BaseModel):
    nome: str
    matricula: str
    funcao: str
    tempo_empresa: str = Field(
        ...,
        description="Tempo de empresa informado pelo colaborador",
    )
    forcas: str
    fraquezas: str
    oportunidades: str
    ameacas: str
    expectativas_2026: str
    contribuicao_2026: str


class PlanejamentoRecord(PlanejamentoCreate):
    timestamp: datetime


class PlanejamentoListResponse(BaseModel):
    total: int
    items: List[PlanejamentoRecord]
