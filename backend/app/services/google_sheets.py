"""Integração com Google Sheets para o Planejamento Estratégico 2026.

Autenticação recomendada:

1) PRODUÇÃO (ex.: Fly.io)
   - Definir a variável de ambiente GCP_SERVICE_ACCOUNT_JSON
     contendo o conteúdo COMPLETO do JSON da conta de serviço.

2) DESENVOLVIMENTO LOCAL
   - Definir GOOGLE_APPLICATION_CREDENTIALS apontando para o
     caminho do arquivo JSON no sistema de arquivos.
   - Opcionalmente, manter settings.google_credentials_path como
     fallback, se estiver configurado.

O SPREADSHEET_ID e SHEET_NAME vêm de app.core.config (settings).
"""
from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Any, Dict, List

from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

from app.core.config import get_settings
from app.schemas.planejamento import PlanejamentoCreate, PlanejamentoRecord

settings = get_settings()
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]


def _get_credentials() -> Credentials:
    """
    Obtém as credenciais do Google a partir de:
    1) GCP_SERVICE_ACCOUNT_JSON (JSON completo em uma env var) ou
    2) GOOGLE_APPLICATION_CREDENTIALS (caminho do arquivo .json) ou
    3) settings.google_credentials_path (fallback opcional).
    """
    # 1) Produção: conteúdo JSON vindo de secret (ex.: Fly.io)
    raw_json = os.getenv("GCP_SERVICE_ACCOUNT_JSON")
    if raw_json:
        info = json.loads(raw_json)
        return Credentials.from_service_account_info(info, scopes=SCOPES)

    # 2) Dev local: caminho do arquivo definido na env
    file_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    # 3) Fallback: caminho vindo das settings (mantém compatibilidade)
    if not file_path and getattr(settings, "google_credentials_path", None):
        file_path = settings.google_credentials_path

    if file_path and os.path.exists(file_path):
        return Credentials.from_service_account_file(file_path, scopes=SCOPES)

    raise RuntimeError(
        "Nenhuma credencial do Google configurada. "
        "Defina GCP_SERVICE_ACCOUNT_JSON (produção) ou "
        "GOOGLE_APPLICATION_CREDENTIALS / settings.google_credentials_path (desenvolvimento)."
    )


def _get_sheet_service():
    credentials = _get_credentials()
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
            payload.expectativas_2026,
            payload.contribuicao_2026,
        ]
    ]

    body = {"values": values}
    # Colunas A até K (11 colunas: timestamp + 10 campos)
    sheet_range = f"{settings.sheet_name}!A:K"

    sheet_service.values().append(
        spreadsheetId=settings.spreadsheet_id,
        range=sheet_range,
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body=body,
    ).execute()

    return PlanejamentoRecord(
        timestamp=datetime.fromisoformat(timestamp),
        **payload.dict(),
    )


def list_registros() -> List[PlanejamentoRecord]:
    sheet_service = _get_sheet_service()
    sheet_range = f"{settings.sheet_name}!A:K"

    result = sheet_service.values().get(
        spreadsheetId=settings.spreadsheet_id,
        range=sheet_range,
    ).execute()

    values: List[List[str]] = result.get("values", [])
    if not values:
        return []

    header = values[0]
    data_rows = values[1:]
    registros: List[PlanejamentoRecord] = []

    for row in data_rows:
        row_dict: Dict[str, Any] = {
            col: row[idx] if idx < len(row) else ""
            for idx, col in enumerate(header)
        }

        raw_timestamp = row_dict.get("timestamp")
        try:
            parsed_timestamp = (
                datetime.fromisoformat(raw_timestamp)
                if raw_timestamp
                else datetime.utcnow()
            )
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
                expectativas_2026=row_dict.get("expectativas_2026", ""),
                contribuicao_2026=row_dict.get("contribuicao_2026", ""),
            )
        )

    return registros