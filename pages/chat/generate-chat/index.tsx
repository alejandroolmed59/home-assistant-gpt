import { CoreMessage } from "ai";
import { useState } from "react";
import { CardDemo, SmartplugComponent, SmartBulbComponent } from "@/components";
import { TermostatoComponent } from "@/components/Termostato";

export default function Page() {
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
        switch: "ON",
      },
    },
    {
      id: "3",
      name: "bedroom upper light",
      type: "smartplug",
      properties: {
        switch: "OFF",
      },
    },
    {
      id: "4",
      name: "bedroom bulb",
      type: "smartbulb",
      properties: {
        color: "#ff0000",
        switch: "ON",
      },
    },
  ]);
  const onSendCommand = async () => {
    {
      setInput("");
      //const newUserMessage = { role: "user", content: input };
      //const response = await fetch("/api/generate-chat", {
      //  method: "POST",
      //  body: JSON.stringify({
      //    messages: [...messages, newUserMessage],
      //  }),
      //});
      //const { message: newMessage } = await response.json();
      //setMessages((currentMessages) => [
      //  ...currentMessages,
      //  newUserMessage,
      //  newMessage,
      //]);
      const responseGenerateObject = await fetch("/api/generate-object", {
        method: "POST",
        body: JSON.stringify({
          devicesStatus: [...devices],
          prompt: input,
        }),
      });
      const devicesUpdateResponse: unknown =
        await responseGenerateObject.json();
      const newDevicesStateArray = Array.isArray(devicesUpdateResponse)
        ? devicesUpdateResponse
        : [devicesUpdateResponse];
      console.log(
        "new state of devices:",
        JSON.stringify(newDevicesStateArray)
      );
      updateArrayState(newDevicesStateArray);
      //if (newMessage.content[0].text === "ACTUALIZAR") {
      //
      //}
    }
  };
  const updateArrayState = (devicesUpdated: any[]) => {
    const modifiedState = devices.map((obj) => {
      // Find the modified object with the same id
      let modifiedObj = devicesUpdated.find((mod) => mod.id === obj.id);
      // If modified object exists, replace the original object with it
      return modifiedObj ? modifiedObj : obj;
    });
    setDevices(modifiedState);
  };
  return (
    <div className="flex flex-col gap-2">
      {/*}
      <div className="flex flex-col p-2 gap-2">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className="flex flex-row gap-2">
            <div className="w-24 text-zinc-500">{`${message.role}: `}</div>
            <div className="w-full">
              {typeof message.content === "string"
                ? message.content
                : message.content
                    .filter((part) => part.type === "text")
                    .map((part, partIndex) => (
                      // @ts-ignore
                      <div key={partIndex}>{part.text}</div>
                    ))}
            </div>
          </div>
        ))}
      </div>
      */}
      <div className="flex justify-center items-center h-screen">
        {devices.map((device) => {
          if (device.type === "smartplug") {
            return (
              <SmartplugComponent
                key={device.id}
                switch={device.properties.switch as "ON" | "OFF"}
              />
            );
          } else if (device.type === "smartbulb") {
            return (
              <SmartBulbComponent
                key={device.id}
                switch={device.properties.switch as "ON" | "OFF"}
                color={device.properties.color!}
              />
            );
          } else if (device.type === "thermostat") {
            return (
              <TermostatoComponent
                key={device.id}
                switch={device.properties.switch as "ON" | "OFF"}
                mode={device.properties.mode as "HEAT" | "COLD"}
                temperature={device.properties.temperature!}
              />
            );
          } else {
            return <CardDemo />;
          }
        })}
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
              await onSendCommand();
            }
          }}
        />
      </div>
    </div>
  );
}
