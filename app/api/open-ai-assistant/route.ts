import OpenAI from "openai";
type Thread = OpenAI.Beta.Threads.Thread;
type Assistant = OpenAI.Beta.Assistants.Assistant;
type ToolOutput =
  OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput;
type Run = OpenAI.Beta.Threads.Runs.Run;
const openai = new OpenAI();

const getAssistant = async (): Promise<Assistant> => {
  const assistantId = process.env.ASSISTANT_ID;
  if (!assistantId) throw new Error("Assistant not defined");
  const myAssistant = await openai.beta.assistants.retrieve(assistantId);
  return myAssistant;
};

const createThread = async (
  initialState: Record<string, any>
): Promise<Thread> => {
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

const createRun = async (
  assistantId: string,
  threadId: string,
  userPrompt: string
): Promise<Run> => {
  const startTime = Date.now();
  const run = await openai.beta.threads.runs.createAndPoll(
    threadId,
    {
      additional_messages: [{ role: "user", content: userPrompt }],
      assistant_id: assistantId,
      parallel_tool_calls: true,
    },
    { pollIntervalMs: 500 }
  );
  const endTime = Date.now();
  console.log(`elapsed in run creation and polling ${endTime - startTime}`);
  return run;
};
const getMessagesFromThread = async (threadId: string) => {
  const threadMessages = await openai.beta.threads.messages.list(threadId);
  const mappedMessages = threadMessages.data.map((messageObject: any) => {
    return {
      role: messageObject.role,
      message: messageObject.content[0].text.value,
    };
  });
  const lastAssistantMessage =
    mappedMessages.find((value) => value.role === "assistant")?.message ?? "";
  return { lastAssistantMessage, messages: mappedMessages };
};

const runDeviceManager = async (
  threadId: string,
  run: Run,
  stateOfDevices: Array<Record<string, any>>
): Promise<{ action: string; devices: Array<Record<string, any>> }> => {
  let newStateOfDevices = structuredClone(stateOfDevices);
  try {
    if (run.status === "completed") {
      return {
        action: "complete",
        devices: newStateOfDevices,
      };
    } else if (run.status === "requires_action") {
      const functions = run.required_action?.submit_tool_outputs.tool_calls;
      const mappedFunctions = functions?.map<ToolOutput>((openAiFunction) => {
        if (openAiFunction.function.name === "update_device") {
          const args: {
            deviceId: string;
            changingProperties: {
              propertyKey: string;
              propertyValue: string;
            }[];
          } = JSON.parse(openAiFunction.function.arguments);
          console.log(
            `Arguments determined for update_device by gpt-4: ${JSON.stringify(args)}`
          );
          const deviceChanging = newStateOfDevices.find(
            (device) => Number(device.id) === Number(args.deviceId)
          );
          if (!deviceChanging)
            return {
              tool_call_id: openAiFunction.id,
              output: JSON.stringify({
                message: "error, device not found",
              }),
            };
          for (const changingProperty of args.changingProperties) {
            deviceChanging.deviceProperties[changingProperty.propertyKey] =
              changingProperty.propertyValue;
          }
          return {
            tool_call_id: openAiFunction.id,
            output: JSON.stringify({
              message: "success",
              device: deviceChanging,
            }),
          };
        }
        if (openAiFunction.function.name === "get_device_status") {
          const args: { deviceId: string } = JSON.parse(
            openAiFunction.function.arguments
          );
          console.log(
            `Arguments determined for get_device_status by gpt-4: ${JSON.stringify(args)}`
          );
          return {
            tool_call_id: openAiFunction.id,
            output: JSON.stringify({
              message: "success",
              device: newStateOfDevices.find(
                (device) => Number(device.id) === Number(args.deviceId)
              ),
            }),
          };
        } else {
          return {
            tool_call_id: openAiFunction.id,
            output: "ERROR, FUNCTION NOT FOUND",
          };
        }
      });
      if (!mappedFunctions)
        throw new Error("No actions present in required_action run status");
      const submitOutput =
        await openai.beta.threads.runs.submitToolOutputsAndPoll(
          threadId,
          run.id,
          {
            tool_outputs: mappedFunctions,
          },
          { pollIntervalMs: 500 }
        );
      return {
        action: "update",
        devices: newStateOfDevices,
      };
    } else {
      throw new Error(`Handler for status not implemented:  ${run.status}`);
    }
  } catch (e) {
    console.log(`Error: ${e}`);
    return {
      action: "unknown",
      devices: newStateOfDevices,
    };
  }
};

export async function POST(req: Request) {
  let { threadId, devices, userPrompt }: any = await req.json();
  if (!threadId) {
    console.log("creando nuevo thread");
    const thread = await createThread(devices);
    threadId = thread.id;
  }
  const assistantId = process.env.ASSISTANT_ID;
  if (!assistantId) throw new Error("Assistant not defined");
  const runObject = await createRun(assistantId, threadId, userPrompt);
  const runExecution = await runDeviceManager(threadId, runObject, devices);
  const messages = await getMessagesFromThread(threadId);
  const response = {
    threadId: threadId,
    runExecutionResult: runExecution,
    messages,
  };
  return Response.json(response);
}
