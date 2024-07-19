import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { supportedDevicesSchema } from "../../../pages/tools/devices";

export async function POST(req: Request) {
  const { prompt, devicesStatus }: { prompt: string; devicesStatus: any[] } =
    await req.json();
  console.log(prompt);
  console.log(devicesStatus);
  const perplexity = createOpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY ?? "",
    baseURL: "https://api.perplexity.ai/",
  });
  const model = perplexity("llama-3-sonar-small-32k-chat");
  const systemPersonality = `You will ONLY respond with a valid Javascript array compatible with a JSON.parse() string, under no circustances you can respondond whith a non parseable string. You are a home assistant that control
  various devices, user might talk to you in spanish, this is the schema of supported devices ${JSON.stringify(
    supportedDevicesSchema
  )}. And this is the current status of the user's devices ${JSON.stringify(
    devicesStatus
  )}. Return a modified object with the users prompt`;
  console.log(String(systemPersonality));
  const generateObjectRequest = await generateText({
    model,
    prompt,
    system: systemPersonality,
  });
  console.log(generateObjectRequest);
  return Response.json({ object: generateObjectRequest.text });
}
