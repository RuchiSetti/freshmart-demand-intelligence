import logging
from typing import Any, Dict

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR


logger = logging.getLogger("app.errors")


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled exception", extra={"path": str(request.url.path)})
        body: Dict[str, Any] = {"error": {"code": "INTERNAL_ERROR", "message": "Internal server error"}}
        return JSONResponse(status_code=HTTP_500_INTERNAL_SERVER_ERROR, content=body)


