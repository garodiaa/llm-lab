# Development Guide

## Prerequisites

- Node.js 22 or newer
- npm 11 or newer
- Python 3.12 or newer

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://127.0.0.1:3000` by default. Configure the backend URL with `NEXT_PUBLIC_API_BASE_URL`.

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

The API runs at `http://127.0.0.1:8000`. Current endpoints are:

- `GET /health`
- `GET /models`
- `POST /generate`
- `POST /compare`
- `POST /visualize`

## Verification

```bash
cd frontend
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

```bash
cd backend
.venv\Scripts\python.exe -m pytest
```
