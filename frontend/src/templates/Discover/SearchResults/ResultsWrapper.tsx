import { motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { ChevronUpIcon } from "#/components/Icons";
import { Box, Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Paginator } from "#/components/Paginator";
import { Body, Heading, Subtext } from "#/components/Typography";

export interface ResultsWrapperProps {
  heading: string;
  isLoading: boolean;
  errorMessage?: string;
  totalCount: number | undefined;
  pageSize: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  children: ReactNode;
}

export const ResultsWrapper = (props: ResultsWrapperProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Stack>
      <Flex css={{ gap: "$3", px: "$4", alignItems: "baseline" }}>
        <Heading>{props.heading}</Heading>
        <Flex
          as="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          css={{
            alignSelf: "center",
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform $1 ease",
          }}
        >
          <ChevronUpIcon />
        </Flex>
        {!!props.totalCount && (
          <Subtext css={{ ml: "$3", color: "$secondaryText" }}>
            {props.totalCount} Result{props.totalCount > 1 ? "s" : ""}
          </Subtext>
        )}
      </Flex>
      <motion.div
        transition={{ duration: 0.3 }}
        custom={isCollapsed}
        animate="state"
        variants={{
          state: (collapsed: boolean) => ({
            height: collapsed ? "0" : "auto",
            overflow: "hidden",
          }),
        }}
      >
        <Box css={{ px: "$4", py: "$5" }}>
          {props.errorMessage && !props.isLoading ? (
            <Body css={{ textAlign: "center", color: "$secondaryText" }}>
              {props.errorMessage}
            </Body>
          ) : props.isLoading || !props.children ? (
            <LoadingArea size="md" />
          ) : (
            <Stack css={{ gap: "$5", alignItems: "center" }}>
              {props.children}
              {!!props.totalCount && Math.ceil(props.totalCount / props.pageSize) > 1 && (
                <Paginator
                  currentPage={props.page}
                  setCurrentPage={props.setPage}
                  totalPages={Math.ceil(props.totalCount / props.pageSize)}
                />
              )}
            </Stack>
          )}
        </Box>
      </motion.div>
    </Stack>
  );
};
