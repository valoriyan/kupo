import { styled } from "#/styling";
import { Stack } from "../Layout";
import { MainTitle, Slogan } from "../Typography";

export const BrandWithSlogan = () => {
  return (
    <Stack css={{ gap: "$3", alignItems: "center" }}>
      <MainTitle as="h1" css={{ fontSize: "$7" }}>
        kupo<Tld>.social</Tld>
      </MainTitle>
      <Slogan>create. support. love</Slogan>
    </Stack>
  );
};

const Tld = styled("span", {
  color: "$secondaryText",
  fontSize: "$5",
  fontWeight: "$regular",
});
