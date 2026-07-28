# LLM Lab — Interactive Inference Learning Platform

![Version](https://img.shields.io/badge/version-1.0.0-1565C0?style=flat)
![Next.js](https://img.shields.io/badge/Next.js%2014-000000?logo=next.js&logoColor=white&style=flat)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white&style=flat)
![License](https://img.shields.io/badge/License-MIT-4CAF50?style=flat)

An interactive, visual learning platform designed to demystify Large Language Models (LLMs) and teach the mechanics of generation.

**Live site**: [https://llm-lab.vercel.app] *(Replace with actual Vercel link once deployed)*

**Main project repository**: https://github.com/garodiaa/llm-lab

### About This Repository

My primary intention with this project is to make learning about LLMs incredibly easy, intuitive, and accessible. 

Most people interact with LLMs as "black box" chatbots. This repository represents an educational laboratory where users can pull apart the AI inference pipeline piece by piece—inspecting tokenization, tuning generation parameters, and seeing the exact mathematical tensors behind text generation. 

### Problem Background

As AI becomes ubiquitous, true understanding of how these models work remains isolated to AI researchers. 
Current tools for interacting with models (like ChatGPT or standard APIs) suffer from:
- A lack of transparency into the generation pipeline (tokens, logits, probabilities).
- No intuitive way to learn the effects of complex parameters like `Temperature`, `Top-P`, or `Top-K`.
- Limited environments for visually comparing different architectures side-by-side.

**LLM Lab** solves this by enforcing a *Learning-first rule*: Whenever the lab shows a result, it also explains why the result happened, visually connecting the output to the underlying math.

### Core Features

**Playground**
- Interactive text generation environment.
- Live, visual breakdown of the tokenization process.
- Real-time adjustment of sampling parameters (Temperature, Top-K, Top-P, Repetition Penalty).

**Model Comparison**
- Run prompts against multiple models simultaneously (e.g., Llama vs Mistral).
- Isolate variables to see exactly how different model architectures handle the exact same settings.

**Inference Visualizer**
- A deep dive into the math.
- Watch raw text become tokens, map to Token IDs, and get packed into PyTorch Tensors.
- See padding strategies, attention masks, and batched shape generation visualized in real-time.

**Knowledge Base (Learn Page)**
- A highly detailed, premium glossary of fundamental LLM building blocks.
- Easy-to-read concepts covering Attention, Token IDs, Decoding, and Sampling algorithms.

### Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14 (App Router) |
| UI/Styling | Tailwind CSS, Shadcn UI, Framer Motion |
| Language | TypeScript |
| Backend API | Hugging Face Inference API |
| Deployment | Vercel (Serverless Edge Functions) |

### Repository Structure

```text
llm-lab/
├── frontend/
│   ├── app/            # Next.js routes, API proxies, and global CSS
│   ├── components/     # Reusable UI components (buttons, cards, headers)
│   ├── lib/            # Utility functions and API helpers
│   └── public/         # Static assets and logos
├── docs/               # Architecture and learning notes
└── README.md
```

### Local Development

1. Clone the repository and move into the frontend directory:
```bash
git clone https://github.com/garodiaa/llm-lab.git
cd llm-lab/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the `frontend` directory and add your Hugging Face access token:
```env
HF_TOKEN=your_hugging_face_token_here
```

4. Start the development server:
```bash
npm run dev
```

### Contributing

Contributions are always welcome! Whether you want to add a new visualization tool, improve the educational copy, or fix a bug, here is how you can help:

1. **Fork the repository** and create your branch from `main`.
2. **Make your changes**, ensuring the UI matches our premium, glassmorphism aesthetic.
3. **Test your code** by running the local development server.
4. **Issue a Pull Request** with a detailed description of your changes.

If you have a major feature idea, please open an Issue first to discuss it!

### Vision

LLM Lab aims to bridge the gap between consuming AI and understanding AI. This repository is a living educational tool designed to replace confusing whitepapers with a structured, searchable, and interactive learning platform.