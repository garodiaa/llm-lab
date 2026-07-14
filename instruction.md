# PROJECT_SPECIFICATION.md

# LLM Lab

**An Interactive Learning Platform for Understanding Large Language Model Inference**

---

# Overview

LLM Lab is an educational web application that helps users understand how Large Language Models (LLMs) work internally. Rather than being another AI chatbot, the application focuses on **learning through interaction and experimentation**.

Users should be able to modify parameters, compare models, inspect every stage of inference, and understand what is happening behind the scenes.

The project should feel like a laboratory where users are encouraged to explore, experiment, and learn.

The overall experience should have a **modern tech vibe** while keeping the learning experience the highest priority.

---

# Primary Goal

The objective is **not** to build another chatbot.

The objective is to build a platform that answers questions like:

* What happens when I enter a prompt?
* What is tokenization?
* Why are tokens converted into IDs?
* What are tensors?
* What does `generate()` actually do?
* Why does temperature change outputs?
* Why do different models respond differently?
* Why are some models faster than others?

Everything should be explained in an intuitive and interactive way.

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide Icons

## Backend

* FastAPI
* Python
* Hugging Face Transformers
* PyTorch

## Deployment

Frontend

* Vercel

Backend

* Hugging Face Spaces (Docker)

---

# Architecture

```text
User

↓

Next.js Frontend

↓

FastAPI Backend

↓

Transformers

↓

Language Models
```

The frontend should never communicate directly with the models.

All inference should happen through the backend API.

The backend should be designed so that additional inference backends (TGI, llama.cpp, vLLM, Ollama, etc.) can be added later without changing the frontend.

---

# Project Structure

```
llm-lab/

frontend/
    app/
    components/
    hooks/
    lib/
    types/
    public/

backend/
    api/
    services/
    models/
    backends/
    utils/

docs/

README.md
```

The frontend and backend should remain completely independent.

---

# Core Philosophy

Every page should follow the same learning pattern.

### 1. Explain

Introduce the concept.

Explain what it is.

Explain why it exists.

---

### 2. Visualize

Show the concept visually.

Avoid long paragraphs whenever possible.

Make users see the inference process.

---

### 3. Experiment

Allow users to change values.

Observe the differences.

Encourage exploration.

---

### 4. Reflect

Explain why the results changed.

Help users connect the experiment with the underlying concept.

---

# Pages

---

# Home

Purpose

Introduce the project.

Include

* What is LLM Lab?
* What users will learn
* Learning roadmap
* Quick navigation to all sections

---

# Playground

Purpose

Teach inference parameters.

Features

* Prompt input
* Model selection
* Parameter controls
* Generated output
* Performance metrics

Supported parameters

* Temperature
* Top P
* Top K
* Max New Tokens
* Repetition Penalty
* Do Sample

Show

* Generation time
* Number of generated tokens
* Tokens per second
* Device information

Every parameter should include a short explanation and practical examples.

---

# Model Comparison

Purpose

Show how different models behave.

Allow users to

* Select multiple models
* Run the same prompt
* Compare outputs side by side

Comparison should include

* Output
* Generation time
* Approximate model size
* Token count

Below the comparison, explain possible reasons for the differences.

---

# Inference Visualizer

This is the main feature of the project.

The inference pipeline should be visualized step-by-step.

```
Prompt

↓

Tokenizer

↓

Tokens

↓

Token IDs

↓

Tensor

↓

Attention Mask

↓

Model

↓

Generated IDs

↓

Decoded Output
```

Every step should contain

* A visual representation
* A short explanation
* Why this step exists
* Relevant code snippet (where helpful)

Users should be able to inspect each stage individually.

---

# Learn Section

This page acts as a lightweight documentation hub.

Topics may include

* What is an LLM?
* What is a Transformer?
* What is Tokenization?
* What are Tokens?
* What are Token IDs?
* What are Tensors?
* What is Attention?
* What is Inference?
* What is Sampling?
* What is Decoding?

Keep explanations concise, beginner-friendly, and supported by simple examples.

---

# Educational Components

Reusable components should be created for educational content.

Examples

* Information Box
* Tip Box
* Warning Box
* Did You Know?
* Experiment Challenge
* Reflection Question

These should be reusable across all pages.

---

# Backend API

The backend should expose simple REST endpoints.

Examples

```
POST /generate

POST /compare

POST /visualize

GET /models

GET /health
```

The frontend should only communicate through these endpoints.

---

# Backend Design

Inference logic should be isolated from the API layer.

Suggested structure

```
backends/

transformers.py

interface.py
```

The application should make it easy to introduce additional inference backends later.

Avoid tightly coupling business logic with the API.

---

# Performance

Models should only be loaded once.

Use caching wherever appropriate.

Avoid unnecessary model reloads.

The application should remain responsive during inference.

---

# Error Handling

Provide user-friendly messages for

* Failed model loading
* Invalid parameters
* Backend unavailable
* Network issues
* Long generation times

Never expose raw Python exceptions to the frontend.

---

# Learning First

Whenever a result is shown, the application should also explain **why** it happened.

Examples

Instead of only displaying generated text,

also explain

* Why the chosen parameter values influenced the output.
* Why one model performed differently from another.
* Why inference took longer.

The educational explanation is just as important as the result itself.

---

# Future Expansion

The architecture should allow future support for

* Text Generation Inference (TGI)
* llama.cpp
* vLLM
* Ollama
* Quantized models
* Streaming responses
* Vision Language Models
* Embedding visualization
* Attention visualization
* KV Cache visualization

These features are **not** part of Version 1 but should be easy to integrate later.

---

# Code Quality

The project should prioritize

* Readability
* Maintainability
* Modular architecture
* Clear naming conventions
* Reusable components
* Separation of concerns

Avoid unnecessary complexity.

---

# Success Criteria

The project is successful if a beginner can:

* Understand the complete inference pipeline.
* Learn through experimentation instead of reading documentation.
* Compare multiple language models.
* Understand generation parameters.
* Visualize tokenization and decoding.
* Build intuition about how Transformers perform inference.

This project should feel less like a chatbot and more like an interactive educational laboratory for learning how Large Language Models work.
