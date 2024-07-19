import { CoreMessage } from "ai";
import { useState } from "react";
import { CardDemo, SmartplugComponent, SmartBulbComponent } from "@/components";
import { TermostatoComponent } from "@/components/Termostato";
import { Input, Alert } from "@mantine/core";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [devices, setDevices] = useState([
    {
      id: "1",
      name: "SmartPlug living room",
      description:
        "Usado para darle electricidad a mi arbol de navidad en navidades o lampara de la sala",
      type: "smartplug",
      properties: {
        switch: "ON",
      },
    },
    {
      id: "2",
      name: "Mi termostato",
      description:
        "En verano gasta mas electricidad de la necesaria al esta encendido en modo COLD todo el dia",
      type: "thermostat",
      properties: {
        mode: "HEAT",
        temperature: 21,
        switch: "ON",
      },
    },
    {
      id: "3",
      name: "SmartPlug cargador movil",
      description:
        "Usado para darle electricidad a telefono celular, lo tengo enchufado en mi habitacion",
      type: "smartplug",
      properties: {
        switch: "OFF",
      },
    },
    {
      id: "4",
      name: "Bombilla de mi habitacion",
      description:
        "Bombilla RGB de mi habitacion, para cuando estoy aburrido puede simular tener una disco en mi propia habitacion",
      type: "smartbulb",
      properties: {
        color: "#6a00c9",
        switch: "ON",
      },
    },
  ]);
  const onSendCommand = async () => {
    {
      setInput("");
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
      return modifiedObj ? { ...obj, ...modifiedObj } : obj;
    });
    setDevices(modifiedState);
  };
  return (
    <div className="flex flex-col gap-2 h-screen">
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
      <h1 className="text-4xl font-bold text-center">
        Smart home automation system
      </h1>
      <div className="flex justify-center items-center mt-5">
        <Alert
          variant="light"
          color="blue"
          withCloseButton={false}
          title="EJEMPLOS DE PRUEBA ✨✨🤖"
          style={{ fontSize: "4rem" }}
        >
          - Encender el smartplug del cargador movil; Apagar todos los plugs;
          Cambiar el color de la bombilla a verde; Cambiar el modo del
          termostato a COLD y bajar la temperatura a 5 grados
        </Alert>
      </div>
      <div className="flex justify-center items-center h-screen">
        {devices.map((device) => {
          if (device.type === "smartplug") {
            return (
              <SmartplugComponent
                key={device.id}
                name={device.name}
                description={device.description}
                switch={device.properties.switch as "ON" | "OFF"}
              />
            );
          } else if (device.type === "smartbulb") {
            return (
              <SmartBulbComponent
                key={device.id}
                name={device.name}
                description={device.description}
                switch={device.properties.switch as "ON" | "OFF"}
                color={device.properties.color!}
              />
            );
          } else if (device.type === "thermostat") {
            return (
              <TermostatoComponent
                key={device.id}
                name={device.name}
                description={device.description}
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
      <div className="fixed bottom-0 p-2 w-full mb-5">
        <Input
          value={input}
          placeholder="Que quieres hacer en tu hogar hoy ? ✨"
          onChange={(event) => {
            setInput(event.target.value);
          }}
          size="xl"
          radius="lg"
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
