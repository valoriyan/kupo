import { useMutation, useQueryClient } from "react-query";
import { Api } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useMakeCreditCardPrimary = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (localCreditCardId: string) => {
      return await Api.makeCardPrimary({ localCreditCardId });
    },
    {
      onSuccess: () => {
        queryClient.removeQueries(CacheKeys.UserCreditCards);
      },
    },
  );
};
