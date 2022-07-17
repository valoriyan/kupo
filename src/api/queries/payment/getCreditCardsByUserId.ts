import { useQuery } from "react-query";
import { useCurrentUserId } from "#/contexts/auth";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, CreditCardSummary } from "../..";

export const useGetCreditCardsByUserId = () => {
  const currentUserId = useCurrentUserId();
  return useQuery<CreditCardSummary[], Error>(
    [CacheKeys.UserCreditCards],
    async () => {
      if (!currentUserId) return [];
      const res = await Api.getCreditCardsStoredByUserId();

      if (res.data.success) {
        return res.data.success.cards;
      }
      throw new Error(
        (res.data.error.reason as string) ?? "Failed to fetch credit cards",
      );
    },
    { enabled: !!currentUserId },
  );
};
