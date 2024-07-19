import { Card, Image, Text, Badge, Button, Group, Grid } from "@mantine/core";
import { PiPlugsConnectedFill, PiPlugsFill } from "react-icons/pi";
import {
  PiThermometer,
  PiThermometerHotDuotone,
  PiThermometerColdDuotone,
} from "react-icons/pi";

export const TermostatoComponent = (props: {
  name: string;
  description: string;
  switch: "ON" | "OFF";
  temperature: number;
  mode: "HEAT" | "COLD";
}) => {
  return (
    <div className="w-1/5 mx-4">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          {props.switch === "OFF" ? (
            <PiThermometer className="w-3/4 h-fit ml-[12%]" />
          ) : props.mode === "HEAT" ? (
            <PiThermometerHotDuotone className="text-red-600 w-3/4 h-fit ml-[12%]" />
          ) : (
            <PiThermometerColdDuotone className="text-cyan-400 w-3/4 h-fit ml-[12%]" />
          )}
        </Card.Section>

        <Grid grow gutter="xs">
          <Grid.Col span={4}>
            <Text fw={500}>{props.name}</Text>
          </Grid.Col>
          {props.switch === "OFF" ? (
            <Grid.Col span={4}>
              <Badge color="#A9A9A9">{props.switch}</Badge>{" "}
            </Grid.Col>
          ) : (
            <Grid.Col span={6}>
              <Badge color={props.mode === "HEAT" ? "#dc2626" : "#22d3ee"}>
                Temperatura {props.temperature}°
              </Badge>
            </Grid.Col>
          )}
        </Grid>

        <Text size="sm" c="dimmed">
          {props.description}
        </Text>
        <Grid grow gutter="xs" className="mt-2">
          <Grid.Col span={6}>
            <Badge
              fullWidth
              color={props.mode === "HEAT" ? "#dc2626" : "#A9A9A9"}
            >
              HEAT
            </Badge>
          </Grid.Col>
          <Grid.Col span={6}>
            <Badge
              fullWidth
              color={props.mode === "COLD" ? "#22d3ee" : "#A9A9A9"}
            >
              COLD
            </Badge>
          </Grid.Col>
        </Grid>
      </Card>
    </div>
  );
};
