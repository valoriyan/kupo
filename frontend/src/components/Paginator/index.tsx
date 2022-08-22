import { Dispatch, SetStateAction } from "react";
import { styled } from "#/styling";
import { range } from "#/utils/range";
import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import { Box, Flex } from "../Layout";

export interface PaginatorProps {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

export const Paginator = (props: PaginatorProps) => {
  let pages: Array<number | "..."> = range(props.totalPages);

  if (pages.length > 7) {
    // Truncation at end
    if (props.currentPage < 5) {
      pages = pages.flatMap((page) => {
        if (page < 5 || page === props.totalPages - 1) {
          return [page];
        } else if (page === props.totalPages - 2) {
          return ["..."];
        } else {
          return [];
        }
      });
    }
    // Truncation at start
    else if (props.currentPage > props.totalPages - 6) {
      pages = pages.flatMap((page) => {
        if (page > props.totalPages - 6 || page === 0) {
          return [page];
        } else if (page === 1) {
          return ["..."];
        } else {
          return [];
        }
      });
    }
    // Truncation on both ends
    else {
      pages = pages.flatMap((page) => {
        if (
          (page > props.currentPage - 2 && page < props.currentPage + 2) ||
          page === 0 ||
          page === props.totalPages - 1
        ) {
          return [page];
        } else if (page === 1 || page === props.totalPages - 2) {
          return ["..."];
        } else {
          return [];
        }
      });
    }
  }

  return (
    <Flex css={{ alignItems: "center" }}>
      <Flex css={{ pr: "$7" }}>
        <IconButton
          onClick={() => props.setCurrentPage((prev) => prev - 1)}
          disabled={props.currentPage === 0}
          aria-label="Previous Page"
        >
          <ChevronLeftIcon />
        </IconButton>
      </Flex>
      <Flex css={{ gap: "$6", alignItems: "center" }}>
        {pages.map((pageNumber, i) => {
          if (typeof pageNumber === "number") {
            return (
              <Box
                as="button"
                key={pageNumber}
                aria-current={props.currentPage === pageNumber ? "page" : undefined}
                onClick={() => props.setCurrentPage(pageNumber)}
                css={{ color: props.currentPage === pageNumber ? "$primary" : "$text" }}
              >
                {pageNumber + 1}
              </Box>
            );
          } else {
            return (
              <button
                key={pageNumber + i}
                onClick={() =>
                  props.setCurrentPage(
                    i < pages.length / 2
                      ? (pages[i + 1] as number) - 1
                      : (pages[i - 1] as number) + 1,
                  )
                }
              >
                ...
              </button>
            );
          }
        })}
      </Flex>
      <Flex css={{ pl: "$7" }}>
        <IconButton
          onClick={() => props.setCurrentPage((prev) => prev + 1)}
          disabled={props.currentPage >= props.totalPages - 1}
          aria-label="Next Page"
        >
          <ChevronRightIcon />
        </IconButton>
      </Flex>
    </Flex>
  );
};

const IconButton = styled("button", {
  lineHeight: 0,
  "&:disabled": {
    color: "$disabledText",
    cursor: "not-allowed",
  },
});
