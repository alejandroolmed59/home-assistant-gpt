import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { PiLightbulb, PiLightbulbDuotone } from "react-icons/pi";

export const SmartBulbComponent = (props: {
  name: string;
  description: string;
  switch: "ON" | "OFF";
  color: string;
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        {props.switch === "ON" ? (
          <PiLightbulbDuotone
            className="w-3/4 h-fit ml-[12%]"
            style={{ color: props.color }}
          />
        ) : (
          <PiLightbulb className="text-slate-950 w-3/4 h-fit ml-[12%]" />
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

      <Badge
        className="mt-2"
        defaultChecked
        variant="gradient"
        fullWidth
        gradient={{ from: "#f23030", to: "#0046de", deg: 70 }}
      >
        RGB enabled
      </Badge>
    </Card>
  );
};
