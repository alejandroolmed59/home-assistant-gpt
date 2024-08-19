export const supportedDevicesSchema = [
  {
    id: { type: "number" },
    deviceType: "smartbulb",
    deviceProperties: {
      deviceName: { type: "string" },
      description: { type: "string" },
      color: {
        type: "hexadecimalstring",
        example: "#74eb34",
      },
      switch: {
        type: "string",
        enum: ["ON", "OFF"],
      },
    },
  },
  {
    id: { type: "number" },
    deviceType: "smartplug",
    deviceProperties: {
      deviceName: { type: "string" },
      description: { type: "string" },
      switch: {
        type: "string",
        enum: ["ON", "OFF"],
      },
    },
  },
  {
    id: { type: "number" },
    deviceType: "thermostat",
    deviceProperties: {
      deviceName: { type: "string" },
      description: { type: "string" },
      mode: {
        type: "string",
        enum: ["HEAT", "COOL"],
      },
      switch: {
        type: "string",
        enum: ["ON", "OFF"],
      },
      temperature: {
        type: "string",
      },
    },
  },
];
