import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { PiLightbulb, PiLightbulbDuotone } from "react-icons/pi";

export const SmartBulbComponent = (props: {
  name: string;
  description: string;
  switch: "ON" | "OFF";
  color: string;
}) => {
  return (
    <div className="w-1/5 mx-4">
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
          <Badge
            defaultChecked
            variant="light"
            gradient={{ from: "#f23030", to: "#0046de", deg: 90 }}
          >
            RGB enabled
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {props.description}
        </Text>

        <Button color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button>
      </Card>
    </div>
  );
};
