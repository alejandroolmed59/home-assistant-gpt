import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const perplexity = createOpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY ?? "",
    baseURL: "https://api.perplexity.ai/",
  });
  const model = perplexity("llama-3-sonar-small-32k-chat");
  console.log("entre a texto!");
  const generatedText = await generateText({
    model,
    system: "You are a helpful assistant. That can only respond using 10 words",
    prompt,
    maxTokens: 100,
  });
  console.log(generatedText);
  return Response.json({ text: generatedText.text });
}
