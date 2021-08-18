import { AppLayout } from "#/components/AppLayout";
import { Box, Stack } from "#/components/Layout";

export const Home = () => {
  return (
    <AppLayout>
      <Stack css={{ gap: "$4", p: "$4" }}>
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
      </Stack>
    </AppLayout>
  );
};

const PlaceholderItem = () => {
  return <Box css={{ width: "100%", minHeight: "$14", bg: "$background3" }} />;
};
