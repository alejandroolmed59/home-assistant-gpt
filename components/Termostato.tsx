import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { PiPlugsConnectedFill, PiPlugsFill } from "react-icons/pi";
import {
  PiThermometer,
  PiThermometerHotDuotone,
  PiThermometerColdDuotone,
} from "react-icons/pi";

export const TermostatoComponent = (props: {
  switch: "ON" | "OFF";
  temperature: number;
  mode: "HEAT" | "COLD";
}) => {
  return (
    <div className="w-1/5 mx-4">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {
          //<Card.Section style={{ color: props.color }}> }
        }
        <Card.Section>
          {props.switch === "OFF" ? (
            <PiThermometer className="w-3/4 h-fit ml-[12%]" />
          ) : props.mode === "HEAT" ? (
            <PiThermometerHotDuotone className="text-red-600 w-3/4 h-fit ml-[12%]" />
          ) : (
            <PiThermometerColdDuotone className="text-cyan-400 w-3/4 h-fit ml-[12%]" />
          )}
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Norway Fjord Adventures</Text>
          {props.switch === "OFF" ? (
            <Badge color="#A9A9A9">{props.switch}</Badge>
          ) : (
            <Badge color={props.mode === "HEAT" ? "#dc2626" : "#22d3ee"}>
              {props.mode} - temperatura {props.temperature}
            </Badge>
          )}
        </Group>

        <Text size="sm" c="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
          with tours and activities on and around the fjords of Norway
        </Text>

        <Button color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    </div>
  );
};
