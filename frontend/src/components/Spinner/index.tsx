import { keyframes, styled } from "#/styling";
import { Stack } from "../Layout";
import { Subtext } from "../Typography";

export interface SpinnerProps {
  /** Size of the spinner */
  size: "xs" | "sm" | "md" | "lg";
  /** Optional text to render below the spinner */
  text?: string;
}

/** This component is used to indicate a loading state */
export const Spinner = ({ size = "md", text }: SpinnerProps) => {
  const spinner = spinnerProperties[size];

  return (
    <Stack css={{ gap: "$3", alignItems: "center" }}>
      <SpinningSVG
        width={spinner.size}
        height={spinner.size}
        viewBox={`0 0 ${spinner.size} ${spinner.size}`}
        fill="none"
      >
        <Circle
          cx={spinner.size / 2}
          cy={spinner.size / 2}
          r={spinner.radius}
          strokeWidth="1.5"
        />
        <Path d={spinner.d} fill="none" strokeWidth="1.5" />
      </SpinningSVG>
      {text && <Subtext css={{ color: "$primary" }}>{text}</Subtext>}
    </Stack>
  );
};

const Circle = styled("circle", { stroke: "$primaryTranslucent" });

const Path = styled("path", { stroke: "$primary" });

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const SpinningSVG = styled("svg", {
  animation: `${spin} $4 linear infinite`,
});

const spinnerProperties: Record<
  SpinnerProps["size"],
  { size: number; radius: number; d: string }
> = {
  xs: {
    size: 12,
    radius: 5.25,
    d: describeArc({ x: 6, y: 6, r: 5.25, startAngle: 0, endAngle: 90 }),
  },
  sm: {
    size: 16,
    radius: 7.25,
    d: describeArc({ x: 8, y: 8, r: 7.25, startAngle: 0, endAngle: 90 }),
  },
  md: {
    size: 20,
    radius: 9.25,
    d: describeArc({ x: 10, y: 10, r: 9.25, startAngle: 0, endAngle: 90 }),
  },
  lg: {
    size: 28,
    radius: 13.25,
    d: describeArc({ x: 14, y: 14, r: 13.25, startAngle: 0, endAngle: 90 }),
  },
};

function describeArc(args: Record<"x" | "y" | "r" | "startAngle" | "endAngle", number>) {
  const { x, y, r, startAngle, endAngle } = args;

  const start = polarToCartesian({ x, y, r, angle: endAngle });
  const end = polarToCartesian({ x, y, r, angle: startAngle });

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(
    " ",
  );

  return d;
}

function polarToCartesian(args: Record<"x" | "y" | "r" | "angle", number>) {
  const angleInRadians = ((args.angle - 90) * Math.PI) / 180;

  return {
    x: args.x + args.r * Math.cos(angleInRadians),
    y: args.y + args.r * Math.sin(angleInRadians),
  };
}
