import { Flex, Stack } from "#/components/Layout";
import { CommunitySuggestions } from "./CommunitySuggestions";
import { UserSuggestions } from "./UserSuggestions";

export const SuggestedContent = () => {
  const divider = (
    <Flex css={{ height: "1px", width: "100%", bg: "$border", my: "$5" }} />
  );

  return (
    <Stack css={{ pt: "$6" }}>
      <UserSuggestions />
      {divider}
      <CommunitySuggestions />
    </Stack>
  );
};
