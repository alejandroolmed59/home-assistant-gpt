import OpenAI from "openai";
type Thread = OpenAI.Beta.Threads.Thread;
const createThread = async (
  initialState: Record<string, any>
): Promise<Thread> => {
  const openai = new OpenAI();
  const thread = await openai.beta.threads.create({
    messages: [
      {
        role: "assistant",
        content: `The initial state of the devices is: ${JSON.stringify(initialState)}`,
      },
    ],
  });
  return thread;
};

export async function POST(req: Request) {
  const { devicesStatus }: any = await req.json();

  const thread = await createThread(devicesStatus);
  return Response.json({ threadId: thread.id });
}
