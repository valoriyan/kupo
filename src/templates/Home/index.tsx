import { Button } from "#/components/Button";
import { Box, Flex, Grid } from "#/components/Layout";
import { logout } from "#/contexts/auth";

export const Home = () => {
  return (
    <Grid
      css={{
        height: "100vh",
        gridTemplateRows: "auto minmax(0, 1fr) auto",
      }}
    >
      <Flex css={{ p: "$3" }}>Header</Flex>
      <Flex
        css={{
          height: "100%",
          overflow: "auto",
          flexDirection: "column",
          gap: "$3",
          px: "$3",
        }}
      >
        <Button size="md" variant="primary" onClick={() => logout()}>
          Log Out
        </Button>
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
        <PlaceholderItem />
      </Flex>
      <Flex css={{ p: "$3" }}>Footer</Flex>
    </Grid>
  );
};

const PlaceholderItem = () => {
  return <Box css={{ width: "100%%", minHeight: "$14", bg: "$primary" }} />;
};
