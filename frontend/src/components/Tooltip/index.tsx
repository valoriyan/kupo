import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { keyframes, prefersMotionSelector, styled } from "#/styling";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  asChild?: boolean;
}

export const Tooltip = ({ content, children, asChild }: TooltipProps) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={0}>
        <RadixTooltip.Trigger asChild={asChild}>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <Content sideOffset={4}>{content}</Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

const fadeIn = keyframes({
  "0%": { opacity: 0 },
  "100%": { opacity: 1 },
});
const fadeOut = keyframes({
  "0%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const Content = styled(RadixTooltip.Content, {
  px: "$4",
  py: "$3",
  borderRadius: "$1",
  backgroundColor: "$background2",
  boxShadow: "$5",
  zIndex: "$dropdown",
  [prefersMotionSelector]: {
    "&[data-state='delayed-open']": {
      animation: `${fadeIn} $2 ease`,
    },
    "&[data-state='closed']": {
      animation: `${fadeOut} $2 ease`,
    },
  },
});
