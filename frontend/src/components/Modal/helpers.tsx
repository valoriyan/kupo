import { styled } from "#/styling";
import { Flex, Stack } from "../Layout";

export const StandardModalWrapper = styled(Stack, {
  gap: "$6",
  px: "$7",
  py: "$6",
  bg: "$modalBackground",
  borderRadius: "$2",
  boxShadow: "$3",
  width: "max-content",
  maxWidth: "min(550px, 90vw)", // Magic Number
  maxHeight: "calc(100vh - 64px)", // Full height minus some vertical padding
  overflow: "auto",
});

export const ModalFooter = styled(Flex, {
  justifyContent: "flex-end",
  gap: "$3",
  pt: "$3",
});
