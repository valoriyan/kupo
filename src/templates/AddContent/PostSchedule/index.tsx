import { Calendar, CalendarState, CALENDAR_HEIGHT } from "#/components/Calendar";
import { AddIcon, RemoveIcon } from "#/components/Icons";
import { Box, Stack } from "#/components/Layout";
import { Body, MainTitle } from "#/components/Typography";
import { styled } from "#/styling";

export interface PostScheduleProps {
  calendarState: CalendarState;
}

export const PostSchedule = (props: PostScheduleProps) => {
  const datesWithAdditions = [
    new Date(2021, 9, 11),
    new Date(2021, 9, 20),
    new Date(2021, 9, 23),
    new Date(2021, 9, 31),
  ];
  const datesWithRemovals = [
    new Date(2021, 9, 12),
    new Date(2021, 9, 20),
    new Date(2021, 9, 17),
    new Date(2021, 9, 29),
  ];

  return (
    <Stack css={{ "@md": { px: "$3", pt: "$3" }, gap: "$5", height: "100%" }}>
      <Box css={{ height: CALENDAR_HEIGHT }}>
        <Calendar
          calendarState={props.calendarState}
          datesWithAdditions={datesWithAdditions}
          datesWithRemovals={datesWithRemovals}
        />
      </Box>
      <Stack css={{ gap: "$5", px: "$3" }}>
        <MainTitle>Summary</MainTitle>
        <Stack css={{ gap: "$3" }}>
          <SummaryText variant="addition">
            <AddIcon />
            You have {datesWithAdditions.length} scheduled posts this month
          </SummaryText>
          <SummaryText variant="removal">
            <RemoveIcon />
            You have {datesWithRemovals.length} posts expiring this month
          </SummaryText>
        </Stack>
      </Stack>
    </Stack>
  );
};

const SummaryText = styled(Body, {
  display: "flex",
  alignItems: "center",
  gap: "$3",

  variants: {
    variant: {
      addition: { svg: { color: "$success" } },
      removal: { svg: { color: "$failure" } },
    },
  },
});
