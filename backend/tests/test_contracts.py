from fastapi.testclient import TestClient

from api.main import app


client = TestClient(app)


def test_models_returns_default_model() -> None:
    response = client.get("/models")

    assert response.status_code == 200
    models = response.json()["models"]
    assert any(model["id"] == "tiny-lab" and model["default"] for model in models)


def test_compare_returns_one_result_per_model() -> None:
    response = client.post(
        "/compare",
        json={
            "prompt": "Explain tensors.",
            "model_ids": ["tiny-lab", "creative-lab"],
            "parameters": {"temperature": 0.8, "max_new_tokens": 64},
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["prompt"] == "Explain tensors."
    assert [result["model_id"] for result in payload["results"]] == ["tiny-lab", "creative-lab"]
    assert payload["reflection"]


def test_generate_rejects_invalid_parameters() -> None:
    response = client.post(
        "/generate",
        json={
            "prompt": "Explain sampling.",
            "parameters": {"temperature": 3.0},
        },
    )

    assert response.status_code == 422
