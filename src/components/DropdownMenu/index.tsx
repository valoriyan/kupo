import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { styled } from "#/styling";
import { ChevronDown } from "../Icons";
import { Body, bodyStyles } from "../Typography";

export interface DropdownMenuItem<T extends string> {
  label: string;
  value: T;
}

export interface DropdownMenuProps<T extends string> {
  trigger: ReactNode;
  items: DropdownMenuItem<T>[];
  selectedItem: T;
  onSelect: (selectedItem: T) => void;
}

export const DropdownMenu = <T extends string>(props: DropdownMenuProps<T>) => {
  const [open, setOpen] = useState(false);

  return (
    <RadixDropdown.Root open={open} onOpenChange={setOpen}>
      <Trigger>
        <Body>{props.trigger}</Body>
        <ChevronDown />
      </Trigger>
      <AnimatePresence initial={false}>
        {open ? (
          <RadixDropdown.Content sideOffset={8} forceMount>
            <ContentBody
              transition={{ duration: 0.25 }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0.5 }}
            >
              <RadixDropdown.RadioGroup
                value={props.selectedItem}
                onValueChange={(value) => props.onSelect(value as T)}
              >
                {props.items.map((item) =>
                  item.value === props.selectedItem ? null : (
                    <RadioItem key={item.value} value={item.value}>
                      {item.label}
                    </RadioItem>
                  ),
                )}
              </RadixDropdown.RadioGroup>
            </ContentBody>
          </RadixDropdown.Content>
        ) : null}
      </AnimatePresence>
    </RadixDropdown.Root>
  );
};

const Trigger = styled(RadixDropdown.Trigger, {
  display: "flex",
  alignItems: "center",
  gap: "$2",
  px: "$3",
});

const ContentBody = styled(motion.div, bodyStyles, {
  bg: "$background1",
  border: "solid $borderWidths$1 $border",
  borderRadius: "$1",
  py: "$2",
  zIndex: "$dropdown",
  transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
});

const RadioItem = styled(RadixDropdown.RadioItem, {
  cursor: "pointer",
  p: "$3",
  "&:focus": {
    outline: "none",
    bg: "$primaryTranslucent",
  },
});
