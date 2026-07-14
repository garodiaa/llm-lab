from typing import Protocol

from models.schemas import GenerateRequest


class InferenceBackend(Protocol):
    def generate(self, request: GenerateRequest) -> dict[str, object]:
        """Generate text and metrics for a request."""
