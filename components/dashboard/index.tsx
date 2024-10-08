import { CoreMessage } from "ai";
import { useEffect, useState } from "react";
import { CardDemo, SmartplugComponent, SmartBulbComponent } from "@/components";
import { TermostatoComponent } from "@/components/Termostato";
import { Input, Alert, Skeleton } from "@mantine/core";
import { useRecordVoice } from "../hooks/speechToText";
import { PiMicrophoneFill } from "react-icons/pi";
import ReactMarkdown from "react-markdown";

export default function Page() {
  const { startRecording, stopRecording, speechToText } = useRecordVoice();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [devices, setDevices] = useState([
    {
      id: 1,
      deviceType: "smartplug",
      deviceProperties: {
        deviceName: "SmartPlug living room",
        description:
          "Used to power my Christmas tree at Christmas, also used for my living room lamp!",
        switch: "ON",
      },
    },
    {
      id: 2,
      deviceType: "thermostat",
      deviceProperties: {
        deviceName: "Home's thermostat",
        description:
          "In summer it uses more electricity than necessary by being on all day. We're in winter right now so it'll probably be set very hot a couple of months",
        mode: "HEAT",
        temperature: "32",
        switch: "ON",
      },
    },
    {
      id: 3,
      deviceType: "smartplug",
      deviceProperties: {
        deviceName: "My smartphone plug",
        description:
          "Used to power my phone, I have it plugged in in my room on the left wall",
        switch: "OFF",
      },
    },
    {
      id: 4,
      deviceType: "smartbulb",
      deviceProperties: {
        deviceName: "My bedroom bulb",
        description:
          "Honestly one of the most usefull things I have ever been gifted! I can change the colors depending on my mood",
        color: "#6a00c9",
        switch: "ON",
      },
    },
  ]);
  const [threadId, setThreadId] = useState<any>();
  const [assistantOutput, setAssistantOutput] = useState<string>("");
  useEffect(() => {
    setInput(speechToText);
  }, [speechToText]);
  const onSendCommand = async () => {
    {
      setInput("");
      setIsLoading(true);
      const responseGenerateObject = await fetch("/api/open-ai-assistant", {
        method: "POST",
        body: JSON.stringify({
          threadId: threadId || "",
          userPrompt: input,
          devices,
        }),
      });
      const response = await responseGenerateObject.json();
      setIsLoading(false);
      if (!response.threadId || !response.runExecutionResult) return;
      setThreadId(response.threadId);
      setDevices(response.runExecutionResult.devices);
      setAssistantOutput(response.messages.lastAssistantMessage);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-screen p-5">
      <h1 className="text-4xl font-bold text-center">
        Smart home virtual assistant
      </h1>

      <div className="h-screen max-h-screen overflow-y-auto grid grid-cols-12 gap-5 p-5">
        {devices.map((device) => {
          let component: JSX.Element;
          if (device.deviceType === "smartplug") {
            component = (
              <SmartplugComponent
                key={device.id}
                name={device.deviceProperties.deviceName}
                description={device.deviceProperties.description}
                switch={device.deviceProperties.switch as "ON" | "OFF"}
              />
            );
          } else if (device.deviceType === "smartbulb") {
            component = (
              <SmartBulbComponent
                key={device.id}
                name={device.deviceProperties.deviceName}
                description={device.deviceProperties.description}
                switch={device.deviceProperties.switch as "ON" | "OFF"}
                color={device.deviceProperties.color!}
              />
            );
          } else if (device.deviceType === "thermostat") {
            component = (
              <TermostatoComponent
                key={device.id}
                name={device.deviceProperties.deviceName}
                description={device.deviceProperties.description}
                switch={device.deviceProperties.switch as "ON" | "OFF"}
                mode={device.deviceProperties.mode as "HEAT" | "COOL"}
                temperature={device.deviceProperties.temperature!}
              />
            );
          } else {
            component = <CardDemo key={0} />;
          }
          return (
            <div
              className="col-span-12 sm:col-span-3"
              children={component}
            ></div>
          );
        })}
      </div>

      <div className="bottom-0 p-2 w-full mb-5">
        <div className="flex justify-center mb-1">
          <div className="rounded-xl px-4 py-3 bg-sky-100 w-full md:w-4/5">
            <h4 className="font-bold mb-1">Assistant output</h4>
            {isLoading ? (
              <>
                <Skeleton height={8} width="45%" mt={6} radius="xl" />
                <Skeleton height={8} width="30%" mt={6} radius="xl" />
                <Skeleton height={8} width="40%" mt={6} radius="xl" />{" "}
                <Skeleton height={8} width="35%" mt={6} radius="xl" />{" "}
              </>
            ) : (
              <ReactMarkdown className="md:text-base sm:text-xs">
                {assistantOutput}
              </ReactMarkdown>
            )}
          </div>
        </div>
        <div className="flex pt-5">
          <Input
            value={input}
            placeholder="What are we doing today ? ✨"
            onChange={(event) => {
              setInput(event.target.value);
            }}
            variant="filled"
            size="xl"
            radius="lg"
            className="w-11/12"
            classNames={{
              input: "outline outline-1 outline-gray-300",
            }}
            onKeyDown={async (event) => {
              if (event.key === "Enter") {
                await onSendCommand();
              }
            }}
          />
          <PiMicrophoneFill
            className="w-1/12 cursor-pointer h-12"
            onMouseDown={startRecording} // Start recording when mouse is pressed
            onMouseUp={stopRecording} // Stop recording when mouse is released
            onTouchStart={startRecording} // Start recording when touch begins on a touch device
            onTouchEnd={stopRecording} // Stop recording when touch ends on a touch device
          />
        </div>
      </div>
    </div>
  );
}
