import { useMutation, useQueryClient } from "react-query";
import { Api } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useStoreCreditCard = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (cardToken: string) => {
      return await Api.storeCreditCard({ paymentProcessorCardToken: cardToken });
    },
    {
      onSuccess: () => {
        queryClient.removeQueries(CacheKeys.UserCreditCards);
      },
    },
  );
};
