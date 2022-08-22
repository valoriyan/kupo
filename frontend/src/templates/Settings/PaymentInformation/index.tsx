import { Stack } from "#/components/Layout";
import { MainTitle } from "#/components/Typography";
import { CardInformation } from "./CardInformation";
import { PurchaseHistory } from "./PurchaseHistory";

export const PaymentInformation = () => {
  return (
    <Stack css={{ p: "$6", gap: "$9" }}>
      <Stack css={{ gap: "$4" }}>
        <MainTitle as="h2">Cards</MainTitle>
        <CardInformation />
      </Stack>
      <Stack css={{ gap: "$5" }}>
        <MainTitle as="h2">Purchase History</MainTitle>
        <PurchaseHistory />
      </Stack>
    </Stack>
  );
};
