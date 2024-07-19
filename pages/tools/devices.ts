export const supportedDevicesSchema = [
  {
    name: "string",
    type: "smartbulb",
    properties: {
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
    name: "string",
    type: "smartplug",
    properties: {
      switch: {
        type: "string",
        enum: ["ON", "OFF"],
      },
    },
  },
  {
    name: "string",
    type: "thermostat",
    properties: {
      mode: {
        type: "string",
        enum: ["HOT", "COLD", "OFF"],
      },
      temperature: {
        type: "string",
      },
    },
  },
];
