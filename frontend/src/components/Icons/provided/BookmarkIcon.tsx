import { useId } from "@radix-ui/react-id";

/** BookmarkIcon icon sourced from https://css.gg/bookmark */
export const BookmarkIcon = ({
  isFilled,
  ...props
}: React.SVGProps<SVGSVGElement> & { isFilled?: boolean }) => {
  const id = useId();

  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <defs>
        <path
          id={id}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 20H17.1717L12.7072 15.5354C12.3166 15.1449 11.6835 15.1449 11.2929 15.5354L6.82843 20L5 20V7C5 5.34315 6.34315 4 8 4H16C17.6569 4 19 5.34314 19 7V20Z"
          fill={isFilled ? "currentColor" : undefined}
        />
        <clipPath id={`${id}-inside`}>
          <use xlinkHref={`#${id}`} />
        </clipPath>
      </defs>
      <use
        xlinkHref={`#${id}`}
        stroke="currentColor"
        strokeWidth={4}
        fill={isFilled ? "currentColor" : undefined}
        clipPath={`url(#${id}-inside)`}
      />
    </svg>
  );
};
