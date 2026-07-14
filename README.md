# LLM Lab

LLM Lab is an interactive learning platform for understanding large language model inference. It is designed as a laboratory, not a chatbot: users can inspect tokenization, tune generation parameters, compare model behavior, and see each step of the inference pipeline.

## Project Structure

```text
frontend/   Next.js, TypeScript, Tailwind CSS interface
backend/    FastAPI inference API and backend adapters
docs/       architecture and learning notes
```

The frontend talks only to the backend API. Model loading and inference stay behind FastAPI so additional backends can be added later without changing the UI.

## Local Development

Detailed setup and verification notes live in `docs/development.md`.

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
pip install -r requirements.txt
uvicorn api.main:app --reload
```

Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` for the frontend if the backend runs on a different host or port.

## Current Status

This is the first working scaffold. The backend uses a deterministic mock inference adapter so the UI and API contracts can be developed before downloading large model weights. The frontend includes the home roadmap, playground, model comparison, inference visualization, and learning reference pages.