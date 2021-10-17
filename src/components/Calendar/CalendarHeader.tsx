import { styled } from "#/styling";
import { ChevronLeft, ChevronRight } from "../Icons";
import { Flex } from "../Layout";
import { MainTitle } from "../Typography";
import { MONTHS } from "./constants";

export interface CalendarHeaderProps {
  year: number;
  month: number;
  toPreviousMonth: () => void;
  toNextMonth: () => void;
}

export const CalendarHeader = (props: CalendarHeaderProps) => {
  return (
    <Flex
      css={{ justifyContent: "space-between", alignItems: "center", p: "$4", gap: "$2" }}
    >
      <MainTitle>{props.year}</MainTitle>
      <Flex css={{ alignItems: "center", gap: "$3" }}>
        <IconButton onClick={props.toPreviousMonth}>
          <ChevronLeft />
        </IconButton>
        <MainTitle css={{ width: "112px", textAlign: "center" }}>
          {MONTHS[props.month]}
        </MainTitle>
        <IconButton onClick={props.toNextMonth}>
          <ChevronRight />
        </IconButton>
      </Flex>
    </Flex>
  );
};

const IconButton = styled("button", { lineHeight: 0 });
