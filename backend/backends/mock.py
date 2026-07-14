from hashlib import sha256

from models.catalog import get_model
from models.schemas import GenerateRequest


class MockInferenceBackend:
    """Deterministic backend used while real model adapters are not configured."""

    def generate(self, request: GenerateRequest) -> dict[str, object]:
        model = get_model(request.model_id)
        params = request.parameters
        seed = int(sha256(f"{request.prompt}|{request.model_id}".encode()).hexdigest(), 16)
        generated_tokens = min(params.max_new_tokens, 24 + seed % 38)
        base_time = 120 + len(request.prompt) * 2 + generated_tokens * 7
        model_multiplier = {"tiny-lab": 0.8, "balanced-lab": 1.1, "creative-lab": 1.45}.get(request.model_id, 1.0)
        generation_time_ms = int(base_time * model_multiplier)
        tokens_per_second = round(generated_tokens / max(generation_time_ms / 1000, 0.001), 2)

        output = self._compose_output(request.prompt, str(model["name"]), params.temperature)
        explanation = (
            f"Temperature {params.temperature} and top-p {params.top_p} shape how many likely next tokens "
            f"remain available. A max token limit of {params.max_new_tokens} caps the response, while "
            f"repetition penalty {params.repetition_penalty} discourages repeated phrasing."
        )

        return {
            "model_id": request.model_id,
            "output": output,
            "explanation": explanation,
            "metrics": {
                "generation_time_ms": generation_time_ms,
                "generated_tokens": generated_tokens,
                "tokens_per_second": tokens_per_second,
                "device": "mock-cpu",
            },
        }

    def _compose_output(self, prompt: str, model_name: str, temperature: float) -> str:
        stance = "focused" if temperature < 0.6 else "exploratory" if temperature > 0.9 else "balanced"
        trimmed_prompt = prompt.strip().rstrip(".")
        return (
            f"{model_name} gives a {stance} explanation of: {trimmed_prompt}. "
            "It would first convert the prompt into tokens, score likely next tokens, "
            "sample or select the next ID, and decode the result back into text."
        )
