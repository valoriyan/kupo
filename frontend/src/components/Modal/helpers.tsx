import { styled } from "#/styling";
import { Stack } from "../Layout";

export const StandardModalWrapper = styled(Stack, {
  gap: "$7",
  px: "$7",
  py: "$6",
  bg: "$modalBackground",
  borderRadius: "$2",
  boxShadow: "$3",
  maxWidth: "min(500px, 90vw)", // Magic Number
  maxHeight: "calc(100vh - 64px)", // Full height minus some vertical padding
  overflow: "auto",
});
