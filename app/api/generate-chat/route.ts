import { CoreMessage, generateText } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { supportedDevicesSchema } from "../../../pages/tools/devices";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();
  const perplexity = createOpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY ?? "",
    baseURL: "https://api.perplexity.ai/",
  });
  const model = perplexity("llama-3-sonar-small-32k-chat");
  const generateTextResponse = await generateText({
    model,
    system: `Eres un asistente virtual que controla y da informacion de dispositivos de una casa. Tu unica funcion es decirme si el usuario hace una pregunta de sus dispositivos para lo que me responderas 'PREGUNTA' o si el usuario quiere actualizar una propiedad de sus dispositivos me responderas 'ACTUALIZAR'`,
    messages,
  });
  console.log(generateTextResponse);
  if (
    generateTextResponse.toolResults.length > 0 &&
    generateTextResponse.toolCalls.length > 0
  ) {
    console.log("PROCEDEMOS A ACTUALIZAR!");
  }
  return Response.json({ message: generateTextResponse.responseMessages[0] });
}
