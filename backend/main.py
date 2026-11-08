from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import uvicorn

from api.livekit import router as livekit_router
from api.pipeline_logs import router as pipeline_logs_router
from api.auth import router as auth_router
from api.sessions import router as sessions_router
from security.rate_limit import cors_origins, docs_enabled

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

_docs = "/docs" if docs_enabled() else None
_redoc = "/redoc" if docs_enabled() else None

app = FastAPI(
    title="Healia - Voice-Powered AI Health Consultant",
    description="A voice-powered AI health consultant",
    version="1.0.0",
    docs_url=_docs,
    redoc_url=_redoc,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(livekit_router)
app.include_router(pipeline_logs_router)
app.include_router(auth_router)
app.include_router(sessions_router)


@app.get("/")
async def root():
    endpoints = {
        "livekit_token": "/api/livekit/token",
        "auth": "/api/auth",
        "sessions": "/api/sessions",
        "health": "/health",
        "health_qdrant": "/health/qdrant",
    }
    if docs_enabled():
        endpoints["docs"] = "/docs"
    return {
        "message": "Healia - Voice-Powered AI Health Consultant",
        "version": "1.0.0",
        "endpoints": endpoints,
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "healia-backend"}


# Fixed point id outside FAISS row range (0..~357k). Touched by keepalive only.
_QDRANT_KEEPALIVE_POINT_ID = 999_999_990


@app.get("/health/qdrant")
async def qdrant_keepalive():
    """Read + write a tiny keepalive point so Qdrant Cloud sees activity."""
    from datetime import datetime, timezone

    from qdrant_client.models import PointStruct, SparseVector

    from qdrant import config
    from qdrant.client import get_client, reset_client

    if not config.is_configured():
        return {
            "status": "error",
            "ok": False,
            "error": "QDRANT_URL / QDRANT_API_KEY not set",
        }

    collection = config.KNOWLEDGE_COLLECTION
    reset_client()
    client = get_client()

    try:
        if not client.collection_exists(collection):
            return {
                "status": "error",
                "ok": False,
                "collection": collection,
                "error": "collection missing",
            }

        count_before = int(client.count(collection_name=collection, exact=False).count)
        now = datetime.now(timezone.utc).isoformat()
        dense = [0.0] * config.VECTOR_SIZE
        dense[0] = 1.0

        client.upsert(
            collection_name=collection,
            points=[
                PointStruct(
                    id=_QDRANT_KEEPALIVE_POINT_ID,
                    vector={
                        config.DENSE_VECTOR: dense,
                        config.SPARSE_VECTOR: SparseVector(indices=[1], values=[1.0]),
                    },
                    payload={
                        "doc_id": "healia_keepalive",
                        "kind": "keepalive",
                        "touched_at": now,
                    },
                )
            ],
            wait=True,
        )

        got = client.retrieve(
            collection_name=collection,
            ids=[_QDRANT_KEEPALIVE_POINT_ID],
            with_payload=True,
            with_vectors=False,
        )
        if not got:
            return {
                "status": "error",
                "ok": False,
                "collection": collection,
                "error": "keepalive point missing after upsert",
            }

        return {
            "status": "healthy",
            "ok": True,
            "collection": collection,
            "points_count": count_before,
            "touched_at": (got[0].payload or {}).get("touched_at") or now,
            "host": config.url_host(),
        }
    except Exception as exc:
        logger.exception("qdrant keepalive failed")
        return {
            "status": "error",
            "ok": False,
            "collection": collection,
            "error": str(exc),
        }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
