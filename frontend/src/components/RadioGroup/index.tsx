import { useId } from "@radix-ui/react-id";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { styled } from "#/styling";
import { Flex } from "../Layout";
import { Body } from "../Typography";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  ariaLabel: string;
  value: string | undefined;
  options: RadioOption[];
  onChange: (value: string) => void;
}

export const RadioGroup = (props: RadioGroupProps) => {
  return (
    <RadioGroupRoot
      aria-label={props.ariaLabel}
      value={props.value}
      onValueChange={props.onChange}
    >
      {props.options.map((option) => (
        <RadioGroupItem key={option.value} option={option} />
      ))}
    </RadioGroupRoot>
  );
};

const RadioGroupRoot = styled(RadixRadioGroup.Root, {
  display: "flex",
  flexDirection: "column",
  gap: "$4",
});

const RadioGroupItem = ({ option }: { option: RadioOption }) => {
  const id = useId();

  return (
    <Flex css={{ gap: "$4", alignItems: "center", cursor: "pointer" }}>
      <RadioItem id={id} value={option.value}>
        <RadioIndicator />
      </RadioItem>
      <Body as="label" htmlFor={id} css={{ cursor: "pointer" }}>
        {option.label}
      </Body>
    </Flex>
  );
};

const RadioItem = styled(RadixRadioGroup.Item, {
  size: "$5",
  bg: "$background1",
  borderRadius: "$round",
  border: "solid $borderWidths$1 $border",
  transition: "background-color $1 ease",

  "&:hover": {
    filter: "unset",
    bg: "$background2",
  },
  "&:active": {
    filter: "unset",
    bg: "$background3",
  },
  "&[data-state=checked]": {
    borderColor: "$primary",
  },
});

const RadioIndicator = styled(RadixRadioGroup.Indicator, {
  size: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&::after": {
    content: "''",
    display: "block",
    size: "$3",
    bg: "$primary",
    borderRadius: "$round",
    transition: "transform $1 ease",
  },
});
