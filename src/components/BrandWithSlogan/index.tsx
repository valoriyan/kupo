import { Stack } from "../Layout";
import { BrandTitle, Slogan } from "../Typography";

export const BrandWithSlogan = () => {
  return (
    <Stack css={{ gap: "$3", alignItems: "center" }}>
      <BrandTitle>
        kupono
        <BrandTitle as="span" css={{ color: "$secondaryText", fontSize: "$5" }}>
          .io
        </BrandTitle>
      </BrandTitle>
      <Slogan>create. support. love</Slogan>
    </Stack>
  );
};
