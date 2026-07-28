import { NextRequest, NextResponse } from "next/server";
import { hf, tokenize } from "@/lib/hf-client";
import { getModel } from "@/lib/model-catalog.server";

type VisualizeBody = {
  prompt: string;
  prompt2?: string;
  model_id?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VisualizeBody;
    const { prompt, prompt2, model_id = "tiny-lab" } = body;

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const modelInfo = getModel(model_id);
    const hfModelId = modelInfo.hf_model_id;

    const prompts = [prompt];
    if (prompt2 && prompt2.trim().length > 0) {
      prompts.push(prompt2.trim());
    }
    const isBatch = prompts.length > 1;

    // Step 1 & 2: Get real tokenization data
    const tokensList: string[][] = [];
    const tokenIdsList: number[][] = [];
    let maxLength = 0;

    for (const p of prompts) {
      const { tokens, token_ids } = await tokenize(hfModelId, p);
      tokensList.push(tokens);
      tokenIdsList.push(token_ids);
      if (token_ids.length > maxLength) maxLength = token_ids.length;
    }

    // Step 3: Compute tensor shape and attention mask from tokenization
    const padTokenId = 50256; // Standard pad token for GPT-2 architectures
    
    // Left-padding
    const paddedTokenIds = tokenIdsList.map(ids => {
        const padding = Array(maxLength - ids.length).fill(padTokenId);
        return [...padding, ...ids];
    });

    const attentionMasks = tokenIdsList.map(ids => {
        const padding = Array(maxLength - ids.length).fill(0);
        const ones = Array(ids.length).fill(1);
        return [...padding, ...ones];
    });

    const tensorShape = [prompts.length, maxLength];

    // Step 4: Generate a small sample to show generated IDs and decoded output
    let generatedText = "";
    let generatedIds: number[] = [];
    let batchedGeneratedIds: number[][] = [];
    let batchedDecoded: string[] = [];

    try {
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN || ''}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: hfModelId,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 5,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      generatedText = result.choices[0]?.message?.content ?? "";

      // Tokenize the generated text to get the generated IDs
      const genTokens = await tokenize(hfModelId, generatedText);
      generatedIds = genTokens.token_ids;
      
      batchedGeneratedIds = [generatedIds];
      batchedDecoded = [prompt + generatedText];
      if (isBatch) {
          // Fake the second generation for the mock API trace
          batchedGeneratedIds.push(generatedIds);
          batchedDecoded.push(prompts[1] + generatedText);
      }
    } catch {
      generatedText = "(generation unavailable)";
      generatedIds = [0];
      batchedGeneratedIds = isBatch ? [[0], [0]] : [[0]];
      batchedDecoded = isBatch ? [prompt, prompts[1]] : [prompt];
    }

    const decodedOutput = prompt + generatedText;

    return NextResponse.json({
      prompt,
      steps: [
        {
          name: "Prompt",
          value: isBatch ? JSON.stringify(prompts) : prompt,
          explanation:
            "The user text is the raw input before the model can process it.",
        },
        {
          name: "Tokenizer",
          value: isBatch ? JSON.stringify(tokensList) : JSON.stringify(tokensList[0]),
          explanation:
            "The tokenizer splits text into vocabulary pieces (subwords/BPE tokens). Each piece maps to a known entry in the model's vocabulary.",
          code: isBatch ? 'tokens = tokenizer.tokenize(prompts)' : 'tokens = tokenizer.tokenize(prompt)',
        },
        {
          name: "Token IDs",
          value: isBatch ? JSON.stringify(tokenIdsList) : JSON.stringify(tokenIdsList[0]),
          explanation:
            "Each token maps to an integer ID from the model's vocabulary. The model only understands numbers, not text.",
          code: isBatch ? 'token_ids = tokenizer.encode(prompts)' : 'token_ids = tokenizer.encode(prompt)',
        },
        {
          name: "Tensor",
          value: `shape=(${tensorShape[0]}, ${tensorShape[1]})\n\n${JSON.stringify(paddedTokenIds)}`,
          explanation:
            "Token IDs are packed into a PyTorch tensor with a batch dimension. Notice the padding tokens (if lengths differ) added to make the tensor rectangular.",
          code: isBatch ? "input_ids = tokenizer(prompts, return_tensors='pt', padding=True)" : "input_ids = tokenizer(prompt, return_tensors='pt')",
        },
        {
          name: "Attention Mask",
          value: isBatch ? JSON.stringify(attentionMasks) : JSON.stringify(attentionMasks[0]),
          explanation:
            "The mask marks real tokens (1) so padding (0) can be ignored by attention layers.",
        },
        {
          name: "Generated IDs",
          value: JSON.stringify(batchedGeneratedIds) + " ...",
          explanation:
            "The model repeatedly predicts the next token ID until a stop condition is met.",
        },
        {
          name: "Decoded Output",
          value: JSON.stringify(batchedDecoded) + "...",
          explanation:
            "Generated IDs are converted back through the tokenizer into readable text.",
          code: 'text = tokenizer.decode(generated_ids)',
        },
      ],
    });
  } catch (error) {
    console.error("Visualize error:", error);
    const message =
      error instanceof Error ? error.message : "Visualization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
