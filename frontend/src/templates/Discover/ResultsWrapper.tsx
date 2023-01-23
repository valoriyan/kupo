import { motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { ChevronUpIcon } from "#/components/Icons";
import { Box, Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Paginator } from "#/components/Paginator";
import { Body, Heading, Subtext } from "#/components/Typography";

export interface Pagination {
  totalCount: number;
  pageSize: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export interface ResultsWrapperProps {
  heading: string;
  isLoading: boolean;
  errorMessage?: string;
  children: ReactNode;
  pagination?: Pagination;
}

export const ResultsWrapper = (props: ResultsWrapperProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { pagination } = props;

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
        {!!pagination?.totalCount && (
          <Subtext css={{ ml: "$3", color: "$secondaryText" }}>
            {pagination.totalCount} Result{pagination.totalCount > 1 ? "s" : ""}
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
              {!!pagination?.totalCount &&
                Math.ceil(pagination.totalCount / pagination.pageSize) > 1 && (
                  <Paginator
                    currentPage={pagination.page}
                    setCurrentPage={pagination.setPage}
                    totalPages={Math.ceil(pagination.totalCount / pagination.pageSize)}
                  />
                )}
            </Stack>
          )}
        </Box>
      </motion.div>
    </Stack>
  );
};
