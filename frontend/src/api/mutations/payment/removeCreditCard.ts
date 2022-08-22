import { useMutation, useQueryClient } from "react-query";
import { Api } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useRemoveCreditCard = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (localCreditCardId: string) => {
      return await Api.removeCreditCard({ localCreditCardId });
    },
    {
      onSuccess: () => {
        queryClient.removeQueries(CacheKeys.UserCreditCards);
      },
    },
  );
};
