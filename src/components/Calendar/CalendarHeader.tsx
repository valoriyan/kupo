import { Flex } from "../Layout";
import { MainTitle } from "../Typography";
import { DropdownMenu } from "../DropdownMenu";
import { MONTHS } from "./constants";
import { range } from "#/utils/range";

export interface CalendarHeaderProps {
  year: number;
  month: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
}

export const CalendarHeader = (props: CalendarHeaderProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      css={{ justifyContent: "space-between", alignItems: "center", p: "$4", gap: "$2" }}
    >
      <DropdownMenu
        trigger={<MainTitle>{props.year}</MainTitle>}
        items={range(currentYear + 5 - 2021)
          .map((year) => year + 2021)
          .map((year) => ({ label: year.toString(), value: year.toString() }))}
        selectedItem={props.year.toString()}
        onSelect={(selectedYear) => props.setYear(parseInt(selectedYear, 10))}
      />
      <DropdownMenu
        trigger={<MainTitle>{MONTHS[props.month]}</MainTitle>}
        items={MONTHS.map((month, index) => ({
          label: month,
          value: index.toString(),
        }))}
        selectedItem={props.month.toString()}
        onSelect={(selectedMonth) => props.setMonth(parseInt(selectedMonth, 10))}
      />
    </Flex>
  );
};
