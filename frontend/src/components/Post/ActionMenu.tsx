import { ComponentType } from "react";
import { styled, ThemeScale } from "#/styling";
import { MoreVerticalAltIcon } from "../Icons";
import { Flex, Stack } from "../Layout";
import { Popover } from "../Popover";
import { Body } from "../Typography";

export interface MenuAction {
  Icon: ComponentType;
  iconColor?: ThemeScale<"colors">;
  label: string;
  onClick: () => void;
}

export interface ActionMenuProps {
  actions: MenuAction[];
  triggerSize?: ThemeScale<"sizes">;
}

export const ActionMenu = (props: ActionMenuProps) => {
  return (
    <Popover trigger={<Trigger css={{ size: props.triggerSize }} />}>
      {({ hide }) => (
        <Stack>
          {props.actions.map(({ Icon, iconColor, label, onClick }) => (
            <MenuOption
              key={label}
              onClick={() => {
                onClick();
                hide();
              }}
            >
              <Flex css={{ color: iconColor }}>
                <Icon />
              </Flex>
              <Body>{label}</Body>
            </MenuOption>
          ))}
        </Stack>
      )}
    </Popover>
  );
};

const Trigger = styled(MoreVerticalAltIcon, {
  display: "flex",
});

const MenuOption = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "$3",
  p: "$3",
  color: "$secondaryText",
});
