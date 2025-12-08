"""Integração com Google Sheets para o Planejamento Estratégico 2026.

Coloque o arquivo de credenciais do serviço no caminho indicado em
GOOGLE_APPLICATION_CREDENTIALS ou em ./credentials.json. O SPREADSHEET_ID deve
ser fornecido via variável de ambiente ou configurado no .env.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

from app.core.config import get_settings
from app.schemas.planejamento import PlanejamentoCreate, PlanejamentoRecord

settings = get_settings()
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


def _get_sheet_service():
    credentials = Credentials.from_service_account_file(settings.google_credentials_path, scopes=SCOPES)
    service = build("sheets", "v4", credentials=credentials)
    return service.spreadsheets()


def append_registro(payload: PlanejamentoCreate) -> PlanejamentoRecord:
    sheet_service = _get_sheet_service()
    timestamp = datetime.utcnow().isoformat()
    values = [
        [
            timestamp,
            payload.nome,
            payload.matricula,
            payload.funcao,
            payload.tempo_empresa,
            payload.forcas,
            payload.fraquezas,
            payload.oportunidades,
            payload.ameacas,
        ]
    ]
    body = {"values": values}
    sheet_range = f"{settings.sheet_name}!A:I"
    sheet_service.values().append(
        spreadsheetId=settings.spreadsheet_id,
        range=sheet_range,
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body=body,
    ).execute()
    return PlanejamentoRecord(timestamp=datetime.fromisoformat(timestamp), **payload.dict())


def list_registros() -> List[PlanejamentoRecord]:
    sheet_service = _get_sheet_service()
    sheet_range = f"{settings.sheet_name}!A:I"
    result = sheet_service.values().get(spreadsheetId=settings.spreadsheet_id, range=sheet_range).execute()
    values: List[List[str]] = result.get("values", [])
    if not values:
        return []

    header = values[0]
    data_rows = values[1:]
    registros: List[PlanejamentoRecord] = []
    for row in data_rows:
        row_dict: Dict[str, Any] = {col: row[idx] if idx < len(row) else "" for idx, col in enumerate(header)}
        raw_timestamp = row_dict.get("timestamp")
        try:
            parsed_timestamp = datetime.fromisoformat(raw_timestamp) if raw_timestamp else datetime.utcnow()
        except ValueError:
            parsed_timestamp = datetime.utcnow()
        registros.append(
            PlanejamentoRecord(
                timestamp=parsed_timestamp,
                nome=row_dict.get("nome", ""),
                matricula=row_dict.get("matricula", ""),
                funcao=row_dict.get("funcao", ""),
                tempo_empresa=row_dict.get("tempo_empresa", ""),
                forcas=row_dict.get("forcas", ""),
                fraquezas=row_dict.get("fraquezas", ""),
                oportunidades=row_dict.get("oportunidades", ""),
                ameacas=row_dict.get("ameacas", ""),
            )
        )
    return registros
