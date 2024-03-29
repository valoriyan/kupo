import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ReactNode, useState } from "react";
import { styled } from "#/styling";
import { Flex } from "../Layout";
import { ScrollArea } from "../ScrollArea";
import { mainTitleStyles } from "../Typography";

export interface Tab {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
}

export interface TabsProps {
  ariaLabel: string;
  tabs: Tab[];
  headerRightContent?: ReactNode;
  stretchTabs?: boolean;
  stickyTabList?: boolean;
}

export const Tabs = (props: TabsProps) => {
  const [selectedTab, setTab] = useState(props.tabs[0]?.id);

  return (
    <TabRoot value={selectedTab} onValueChange={setTab} orientation="horizontal">
      <TabList
        aria-label={props.ariaLabel}
        hasRightContent={!!props.headerRightContent}
        css={
          props.stickyTabList
            ? { bg: "$pageBackground", position: "sticky", top: 0, zIndex: 1 }
            : undefined
        }
      >
        <ScrollArea>
          <Flex>
            {props.tabs.map((tab) => (
              <Trigger key={tab.id} value={tab.id} stretchTabs={props.stretchTabs}>
                {tab.trigger}
              </Trigger>
            ))}
          </Flex>
        </ScrollArea>
        {props.headerRightContent ?? null}
      </TabList>
      {props.tabs.map(
        (tab) =>
          tab.id === selectedTab && (
            <TabsPrimitive.Content key={tab.id} value={tab.id}>
              {tab.content}
            </TabsPrimitive.Content>
          ),
      )}
    </TabRoot>
  );
};

const TabRoot = styled(TabsPrimitive.Root, {
  width: "100%",
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
});

const TabList = styled(TabsPrimitive.TabsList, {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  boxShadow: "inset 0 -1px 0 0 $colors$border",

  variants: {
    hasRightContent: { true: { justifyContent: "space-between" } },
  },
});

const Trigger = styled(TabsPrimitive.Trigger, mainTitleStyles, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "$8",
  px: "$5",
  whiteSpace: "nowrap",
  fontWeight: "$regular",
  color: "$secondaryText",
  transition: "color $1 ease, box-shadow $1 ease",
  cursor: "pointer",

  "&:hover": { filter: "brightness(0.9)" },

  '&[data-state="active"]': {
    color: "$primary",
    boxShadow:
      "inset 0 -3px 0 0 $colors$primarySubdued, 0 1px 0 0 $colors$primarySubdued",
  },

  variants: {
    stretchTabs: { true: { flex: 1 } },
  },
});
