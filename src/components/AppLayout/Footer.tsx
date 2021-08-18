import { Flex } from "../Layout";
import { styled } from "#/styling";
import { Bell, Home, Mail, Menu, Plus } from "../Icons";

export const Footer = () => {
  return (
    <Wrapper>
      <Home />
      <Bell />
      <Upload>
        <Plus />
      </Upload>
      <Mail />
      <Menu />
    </Wrapper>
  );
};

const Wrapper = styled(Flex, {
  px: "$7",
  py: "$3",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopStyle: "solid",
  borderTopWidth: "$1",
  borderTopColor: "$border",
});

const Upload = styled("button", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "$accentText",
  borderRadius: "$5",
  px: "$5",
  py: "$3",
  background: "linear-gradient(202.17deg, #FF00D6 8.58%, #FF4D00 91.42%)",
});
