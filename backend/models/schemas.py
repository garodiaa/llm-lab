from pydantic import BaseModel, Field


class GenerationParameters(BaseModel):
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=0.9, ge=0.0, le=1.0)
    top_k: int = Field(default=40, ge=1, le=200)
    max_new_tokens: int = Field(default=80, ge=1, le=512)
    repetition_penalty: float = Field(default=1.05, ge=1.0, le=2.0)
    do_sample: bool = True


class GenerateRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    model_id: str = "tiny-lab"
    parameters: GenerationParameters = Field(default_factory=GenerationParameters)


class CompareRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    model_ids: list[str] = Field(default_factory=lambda: ["tiny-lab", "balanced-lab"], min_length=1)
    parameters: GenerationParameters = Field(default_factory=GenerationParameters)


class VisualizeRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    model_id: str = "tiny-lab"
