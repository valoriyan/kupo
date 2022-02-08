import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Box, Flex, Stack } from "#/components/Layout";
import { Body, Heading } from "#/components/Typography";
import { ChevronUpIcon } from "#/components/Icons";
import { LoadingArea } from "#/components/LoadingArea";

export interface ResultsWrapperProps {
  heading: string;
  isLoading: boolean;
  errorMessage?: string;
  children: ReactNode;
}

export const ResultsWrapper = (props: ResultsWrapperProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Stack>
      <Flex css={{ gap: "$3", px: "$4" }}>
        <Heading>{props.heading}</Heading>
        <Flex
          as="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          css={{
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform $1 ease",
          }}
        >
          <ChevronUpIcon />
        </Flex>
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
        <Box css={{ px: "$4", py: "$4" }}>
          {props.errorMessage && !props.isLoading ? (
            <Body css={{ textAlign: "center" }}>{props.errorMessage}</Body>
          ) : props.isLoading || !props.children ? (
            <LoadingArea size="md" />
          ) : (
            props.children
          )}
        </Box>
      </motion.div>
    </Stack>
  );
};
