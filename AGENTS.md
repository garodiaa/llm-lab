# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains `instruction.md`, the product specification. Use it as the source of truth while scaffolding the app. The intended layout is:

- `frontend/`: Next.js and TypeScript app. Use `app/` for routes, `components/` for reusable UI and educational pieces, and `hooks/`, `lib/`, `types/`, and `public/` for shared client assets.
- `backend/`: FastAPI inference API. Use `api/` for routes, `services/` for orchestration, `backends/` for Transformers and future adapters, `models/` for metadata, and `utils/` for helpers.
- `docs/`: architecture notes, learning content, and diagrams.

Keep frontend and backend independent. The frontend should call backend endpoints such as `/generate`, `/compare`, `/visualize`, `/models`, and `/health`.

## Build, Test, and Development Commands

No package manifests are present yet. After scaffolding, prefer these commands:

- `cd frontend && npm run dev`: run the Next.js development server.
- `cd frontend && npm run build`: create a production frontend build.
- `cd frontend && npm run lint`: run TypeScript and lint checks.
- `cd backend && python -m venv .venv`: create a Python virtual environment.
- `cd backend && pip install -r requirements.txt`: install backend dependencies.
- `cd backend && uvicorn api.main:app --reload`: run the FastAPI server locally.
- `cd backend && pytest`: run backend tests.

Document new standard commands in `README.md`.

## Coding Style & Naming Conventions

Use TypeScript for frontend code and Python for backend code. Prefer descriptive names: `InferenceVisualizer`, `ParameterControl`, `transformers_backend.py`, and `model_registry.py`. Keep API logic thin and place inference behavior in services or backend adapters. Use 2-space indentation for TypeScript/TSX and 4-space indentation for Python.

## Testing Guidelines

Place frontend tests near the component or route they cover, using names such as `ParameterControl.test.tsx`. Place backend tests under `backend/tests/` with names such as `test_generate_api.py`. Prioritize coverage for API contracts, parameter validation, backend adapter behavior, and educational visualizer transformations.

## Commit & Pull Request Guidelines

This repository has no commit history yet. Use concise, imperative commit messages with an optional scope, for example `feat(frontend): add playground controls` or `test(backend): cover parameter validation`. Pull requests should include a short summary, testing notes, linked issues if available, and screenshots or recordings for UI changes.

## Agent-Specific Instructions

Preserve the learning-first product direction in `instruction.md`. When adding features, follow the pattern: explain, visualize, experiment, and reflect.
