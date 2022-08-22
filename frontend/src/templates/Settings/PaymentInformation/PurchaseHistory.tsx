import { Flex } from "#/components/Layout";
import { Body } from "#/components/Typography";

export const PurchaseHistory = () => {
  // TODO: Implement purchase history

  return (
    <Flex
      css={{
        px: "$5",
        py: "$4",
        bg: "$background3",
        color: "$secondaryText",
        borderRadius: "$3",
      }}
    >
      <Body>No purchase history found.</Body>
    </Flex>
  );
};
