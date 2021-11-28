import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ReactNode } from "react";
import { styled } from "#/styling";
import { mainTitleStyles } from "../Typography";

export interface Tab {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  ariaLabel: string;
  tabs: Tab[];
}

export const Tabs = (props: TabsProps) => {
  return (
    <TabRoot defaultValue={props.tabs[0].id} orientation="horizontal">
      <TabList aria-label={props.ariaLabel}>
        {props.tabs.map((tab) => (
          <Trigger key={tab.id} value={tab.id}>
            {tab.trigger}
          </Trigger>
        ))}
      </TabList>
      {props.tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.id} value={tab.id}>
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabRoot>
  );
};

const TabRoot = styled(TabsPrimitive.Root, {
  height: "100%",
  overflow: "auto",
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
});

const TabList = styled(TabsPrimitive.TabsList, {
  display: "flex",
  flexShrink: 0,
  borderBottomStyle: "solid",
  borderBottomWidth: "$1",
  borderBottomColor: "$border",
});

const Trigger = styled(TabsPrimitive.Trigger, mainTitleStyles, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  height: "$7",
  px: "$4",
  fontWeight: "$regular",
  color: "$text",
  transition: "color $1 ease, box-shadow $1 ease",
  cursor: "pointer",

  "&:hover": { color: "$primary" },

  '&[data-state="active"]': {
    fontWeight: "$bold",
    color: "$primary",
    boxShadow: "inset 0 -3px 0 0 currentColor, 0 1px 0 0 currentColor",
  },
});
