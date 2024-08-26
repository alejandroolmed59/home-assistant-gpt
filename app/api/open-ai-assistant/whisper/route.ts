import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { Readable } from "stream";

export async function POST(req: Request) {
  const openai = new OpenAI();
  const body = await req.json();
  const base64Audio = body.audio;
  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, "base64");
  try {
    const converted = await toFile(Readable.from(audio), "recording.webm");
    const data = await openai.audio.transcriptions.create({
      file: converted,
      model: "whisper-1",
    });
    // Remove the temporary file after successful processing
    //fs.unlinkSync(filePath);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}
