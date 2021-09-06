import { Box, Stack } from "#/components/Layout";

export const Home = () => {
  return (
    <Stack css={{ gap: "$4", p: "$4" }}>
      <PlaceholderItem />
      <PlaceholderItem />
      <PlaceholderItem />
      <PlaceholderItem />
      <PlaceholderItem />
      <PlaceholderItem />
    </Stack>
  );
};

const PlaceholderItem = () => {
  return <Box css={{ width: "100%", minHeight: "$14", bg: "$background3" }} />;
};
