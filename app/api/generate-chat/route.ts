import { CoreMessage, generateText } from "ai";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();
  const perplexity = createOpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY ?? "",
    baseURL: "https://api.perplexity.ai/",
  });
  const model = perplexity("llama-3.1-sonar-small-128k-chat");
  const generateTextResponse = await generateText({
    model,
    system: `Eres un asistente de una casa inteligente que controla varios dispositivos inteligentes como smartplugs, smartbulbs, termostatos. Tu unica funcion es decirme si el usuario quiere actualizar una propiedad de sus dispositivos, busca palabras claves en la peticion como 'actualiza', 'apaga', 'enciende', 'cambia', si es así me responderas 'ACTUALIZAR'. Si el usuario hace una pregunta del estado de sus dispositivos me responderas 'PREGUNTA'. Tus unicas respuestas validas son 'ACTUALIZAR' y 'PREGUNTA'  `,
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
