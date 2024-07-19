import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { PiPlugsConnectedFill, PiPlugsFill } from "react-icons/pi";

export const SmartplugComponent = (props: {
  name: string;
  description: string;
  switch: "ON" | "OFF";
}) => {
  return (
    <div className="w-1/5 mx-4">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {
          //<Card.Section style={{ color: props.color }}> }
        }
        <Card.Section>
          {props.switch === "ON" ? (
            <PiPlugsConnectedFill className="text-yellow-500 w-3/4 h-fit ml-[12%]" />
          ) : (
            <PiPlugsFill className="w-3/4 h-fit ml-[12%]" />
          )}
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>{props.name}</Text>
          <Badge color={props.switch === "ON" ? "#46E14E" : "#A9A9A9"}>
            {props.switch}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {props.description}
        </Text>
      </Card>
    </div>
  );
};
