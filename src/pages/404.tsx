import { ReactElement } from "react";
import { AppLayout } from "#/components/AppLayout";
import { Stack } from "#/components/Layout";
import { Heading, MainTitle } from "#/components/Typography";

export const Kupono404 = () => {
  return (
    <Stack
      css={{ justifyContent: "center", alignItems: "center", pt: "30vh", gap: "$4" }}
    >
      <MainTitle as="h1" css={{ color: "$primary", fontSize: "$8" }}>
        404
      </MainTitle>
      <Heading>This page could not be found</Heading>
    </Stack>
  );
};

Kupono404.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>;

export default Kupono404;
