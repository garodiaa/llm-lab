import { NextResponse } from "next/server";
import { MODEL_CATALOG } from "@/lib/model-catalog.server";

export async function GET() {
  // Strip internal hf_model_id from the public response
  const models = MODEL_CATALOG.map(({ hf_model_id: _, ...rest }) => rest);
  return NextResponse.json({ models });
}
