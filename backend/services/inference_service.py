from backends.mock import MockInferenceBackend
from models.catalog import MODEL_CATALOG, get_model
from models.schemas import CompareRequest, GenerateRequest, VisualizeRequest


class InferenceService:
    def __init__(self) -> None:
        self.backend = MockInferenceBackend()

    def list_models(self) -> list[dict[str, object]]:
        return MODEL_CATALOG

    def generate(self, request: GenerateRequest) -> dict[str, object]:
        return self.backend.generate(request)

    def compare(self, request: CompareRequest) -> dict[str, object]:
        results = []
        for model_id in request.model_ids:
            generate_request = GenerateRequest(
                prompt=request.prompt,
                model_id=model_id,
                parameters=request.parameters,
            )
            model = get_model(model_id)
            result = self.generate(generate_request)
            results.append(
                {
                    **result,
                    "model_name": model["name"],
                    "model_size": model["size"],
                }
            )

        return {
            "prompt": request.prompt,
            "results": results,
            "reflection": (
                "Different profiles change speed, wording, and apparent creativity because each adapter can use "
                "different weights, decoding defaults, or runtime constraints."
            ),
        }

    def visualize(self, request: VisualizeRequest) -> dict[str, object]:
        tokens = request.prompt.strip().split()
        token_ids = [self._stable_token_id(token) for token in tokens]
        generated_ids = token_ids[-3:] + [101, 204, 309]
        attention_mask = [1 for _ in tokens]

        return {
            "prompt": request.prompt,
            "steps": [
                {
                    "name": "Prompt",
                    "value": request.prompt,
                    "explanation": "The user text is the raw input before the model can process it.",
                },
                {
                    "name": "Tokenizer",
                    "value": str(tokens),
                    "explanation": "A tokenizer splits text into vocabulary pieces. This mock uses words for readability.",
                    "code": "tokens = tokenizer(prompt)",
                },
                {
                    "name": "Token IDs",
                    "value": str(token_ids),
                    "explanation": "Each token maps to an integer ID so it can become numerical model input.",
                },
                {
                    "name": "Tensor",
                    "value": f"shape=(1, {len(token_ids)})",
                    "explanation": "Token IDs are packed into a tensor with a batch dimension.",
                    "code": "input_ids = torch.tensor([token_ids])",
                },
                {
                    "name": "Attention Mask",
                    "value": str(attention_mask),
                    "explanation": "The mask marks real tokens so padding can be ignored by attention layers.",
                },
                {
                    "name": "Generated IDs",
                    "value": str(generated_ids),
                    "explanation": "The model repeatedly predicts the next token ID until a stop condition is met.",
                },
                {
                    "name": "Decoded Output",
                    "value": " ".join(tokens + ["...generated", "continuation"]),
                    "explanation": "Generated IDs are converted back through the tokenizer into readable text.",
                    "code": "text = tokenizer.decode(generated_ids)",
                },
            ],
        }

    def _stable_token_id(self, token: str) -> int:
        return sum((index + 1) * ord(char) for index, char in enumerate(token)) % 50000
