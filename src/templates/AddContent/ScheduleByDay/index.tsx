import { MONTHS } from "#/components/Calendar";
import { Stack } from "#/components/Layout";
import { Body, truncateByLines } from "#/components/Typography";
import { styled } from "#/styling";

export interface ScheduleByDayProps {
  date: Date;
}

export const ScheduleByDay = (props: ScheduleByDayProps) => {
  return (
    <Stack>
      <PostWrapper>
        <PostImage />
        <Stack css={{ height: "100%", gap: "$2", justifyContent: "space-between" }}>
          <PostCaption>
            It’s {MONTHS[props.date.getMonth()]} {props.date.getDate()}! Wooo!! Who’s all
            ready for {MONTHS[props.date.getMonth()]} {props.date.getDate() + 1}?!
          </PostCaption>
          <Time css={{ color: "$success" }}>Posts @ 9:00pm</Time>
        </Stack>
      </PostWrapper>
      <PostWrapper>
        <PostImage />
        <Stack css={{ height: "100%", gap: "$2", justifyContent: "space-between" }}>
          <PostCaption>
            It’s {MONTHS[props.date.getMonth()]} {props.date.getDate()}! Wooo!! Who’s all
            ready for {MONTHS[props.date.getMonth()]} {props.date.getDate() + 1}?!
          </PostCaption>
          <Time css={{ color: "$failure" }}>Expires @ 10:00pm</Time>
        </Stack>
      </PostWrapper>
    </Stack>
  );
};

const PostWrapper = styled("div", {
  p: "$6",
  borderBottom: "solid $borderWidths$1 $border",
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  columnGap: "$5",
});

const PostImage = styled("div", {
  size: "$12",
  bg: "$border",
});

const PostCaption = styled(Body, truncateByLines(5));

const Time = styled(Body, { fontWeight: "$bold" });
