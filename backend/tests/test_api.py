from fastapi.testclient import TestClient

from api.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_generate_returns_metrics() -> None:
    response = client.post(
        "/generate",
        json={
            "prompt": "Explain tokens.",
            "model_id": "tiny-lab",
            "parameters": {"temperature": 0.7},
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["model_id"] == "tiny-lab"
    assert payload["metrics"]["generated_tokens"] > 0
    assert "explanation" in payload


def test_visualize_returns_pipeline_steps() -> None:
    response = client.post("/visualize", json={"prompt": "hello lab"})

    assert response.status_code == 200
    payload = response.json()
    names = [step["name"] for step in payload["steps"]]
    assert names == [
        "Prompt",
        "Tokenizer",
        "Token IDs",
        "Tensor",
        "Attention Mask",
        "Generated IDs",
        "Decoded Output",
    ]
