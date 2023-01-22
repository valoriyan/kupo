import { Story } from "@storybook/react";
import { useState } from "react";
import { DropdownMenu } from ".";
import { MONTHS } from "../Calendar";
import { Box } from "../Layout";

export default {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
};

export const Template: Story = () => {
  const [selectedItem, selectItem] = useState<(typeof MONTHS)[number]>(MONTHS[0]);

  return (
    <Box css={{ p: "$5" }}>
      <DropdownMenu
        trigger={selectedItem}
        items={MONTHS.map((month) => ({ label: month, value: month }))}
        selectedItem={selectedItem}
        onSelect={selectItem}
      />
    </Box>
  );
};
