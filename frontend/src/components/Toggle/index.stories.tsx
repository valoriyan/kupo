import { Story } from "@storybook/react";
import { useState } from "react";
import { Toggle } from ".";

export default {
  title: "Components/Toggle",
  component: Toggle,
};

export const Template: Story = () => {
  const [toggled, setToggled] = useState(false);
  return <Toggle toggled={toggled} setToggled={setToggled} />;
};
