from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import CompareRequest, GenerateRequest, VisualizeRequest
from services.inference_service import InferenceService

app = FastAPI(title="LLM Lab API", version="0.1.0")
service = InferenceService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/models")
def list_models() -> dict[str, list[dict[str, object]]]:
    return {"models": service.list_models()}


@app.post("/generate")
def generate(request: GenerateRequest) -> dict[str, object]:
    return service.generate(request)


@app.post("/compare")
def compare(request: CompareRequest) -> dict[str, object]:
    return service.compare(request)


@app.post("/visualize")
def visualize(request: VisualizeRequest) -> dict[str, object]:
    return service.visualize(request)
