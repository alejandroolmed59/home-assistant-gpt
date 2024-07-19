import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { supportedDevicesSchema } from "@/utils/devices";

export async function POST(req: Request) {
  const { prompt, devicesStatus }: { prompt: string; devicesStatus: any[] } =
    await req.json();
  const perplexity = createOpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY ?? "",
    baseURL: "https://api.perplexity.ai/",
  });
  const model = perplexity("llama-3-sonar-small-32k-chat");
  const systemPersonality = `You will ONLY respond with a valid Javascript array compatible with a JSON.parse() string, under no circustances you can respond with a non parseable string. You are a home assistant that controls
  various devices, user might talk to you in spanish, this is the schema of supported devices ${JSON.stringify(
    supportedDevicesSchema
  )}. And this is the current status of the user's devices ${JSON.stringify(
    devicesStatus
  )}. Return a modified object with the users prompt, for each modified device always return the 'properties' with all their properties, even if some are unmodified. If there is no need to update the devices, return an empty array.`;
  console.log(String(systemPersonality));
  const generateObjectRequest = await generateText({
    model,
    prompt,
    system: systemPersonality,
  });
  try {
    const parsedObj = JSON.parse(generateObjectRequest.text);
    return Response.json(parsedObj);
  } catch (e) {
    console.error("cannot parse response from ai", e);
    return Response.json([]);
  }
}
