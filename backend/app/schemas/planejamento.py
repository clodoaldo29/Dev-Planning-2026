from datetime import datetime
from typing import List

from pydantic import BaseModel, Field


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
]


class PlanejamentoCreate(BaseModel):
    nome: str
    matricula: str
    funcao: str
    tempo_empresa: str = Field(..., description="Tempo de empresa informado pelo colaborador")
    forcas: str
    fraquezas: str
    oportunidades: str
    ameacas: str


class PlanejamentoRecord(PlanejamentoCreate):
    timestamp: datetime


class PlanejamentoListResponse(BaseModel):
    total: int
    items: List[PlanejamentoRecord]
