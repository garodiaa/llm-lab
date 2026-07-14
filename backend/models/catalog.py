MODEL_CATALOG: list[dict[str, object]] = [
    {
        "id": "tiny-lab",
        "name": "Tiny Lab Model",
        "size": "125M parameters",
        "description": "Fast profile for teaching token flow and latency tradeoffs.",
        "default": True,
    },
    {
        "id": "balanced-lab",
        "name": "Balanced Lab Model",
        "size": "350M parameters",
        "description": "Middle profile with steadier wording and moderate latency.",
        "default": False,
    },
    {
        "id": "creative-lab",
        "name": "Creative Lab Model",
        "size": "760M parameters",
        "description": "Exploratory profile that emphasizes sampling differences.",
        "default": False,
    },
]


def get_model(model_id: str) -> dict[str, object]:
    for model in MODEL_CATALOG:
        if model["id"] == model_id:
            return model
    return MODEL_CATALOG[0]
