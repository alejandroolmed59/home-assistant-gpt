import { CoreMessage } from "ai";
import { useState } from "react";

export default function Page() {
  const [generation, setGeneration] = useState<{ notifications: any[] }>({
    notifications: [],
  });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [devices, setDevices] = useState([
    {
      id: "1",
      name: "living room plug",
      type: "smartplug",
      properties: {
        switch: "ON",
      },
    },
    {
      id: "2",
      name: "my air",
      type: "thermostat",
      properties: {
        mode: "HEAT",
        temperature: 21,
      },
    },
    {
      id: "3",
      name: "beedroom upper light",
      type: "smartplug",
      properties: {
        switch: "OFF",
      },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-2 flex flex-col gap-2">
      <div
        className="p-2 bg-zinc-100 cursor-pointer"
        onClick={async () => {
          console.log(messages);
        }}
      >
        print mensajes
      </div>
      <div className="fixed bottom-0 p-2 w-full">
        <input
          value={input}
          placeholder="Send message..."
          onChange={(event) => {
            setInput(event.target.value);
          }}
          className="bg-zinc-100 w-full p-2"
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              setInput("");
              setIsLoading(true);
              const request = {
                role: "user",
                content: input,
              };
              const response = await fetch("/api/generate-chat", {
                method: "POST",
                body: JSON.stringify({
                  messages: [...messages, request],
                }),
              });

              const { message: newMessage } = await response.json();
              setMessages((currentMessages) => [
                ...currentMessages,
                request,
                newMessage,
              ]);
              setIsLoading(false);
            }
          }}
        />
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <pre
          className="text-sm w-full whitespace-pre-wrap"
          data-testid="generation"
        >
          {generation?.notifications?.map((noti) => (
            <div>
              <h1>{noti.name}</h1>
              <p>{noti.message}</p>
            </div>
          ))}
        </pre>
      )}
    </div>
  );
}
