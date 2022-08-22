import { useMutation, useQueryClient } from "react-query";
import { Api, CreditCardSummary } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useStoreCreditCard = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      token,
    }: {
      token: string;
      last4: string;
      expMonth: string;
      expYear: string;
      cardholderName: string;
      brand: string;
    }) => {
      return await Api.storeCreditCard({ paymentProcessorCardToken: token });
    },
    {
      onSuccess: (data, variables) => {
        const cards = queryClient.getQueryData<CreditCardSummary[]>(
          CacheKeys.UserCreditCards,
        );
        const cardResponse = data.data.success;

        if (!cards || !cardResponse) return;

        queryClient.setQueryData<CreditCardSummary[]>(
          CacheKeys.UserCreditCards,
          (prev) => {
            const newCard: CreditCardSummary = {
              ...cardResponse,
              last4: variables.last4,
              expMonth: variables.expMonth,
              expYear: variables.expYear,
              cardholderName: variables.cardholderName,
              brand: variables.brand,
            };
            if (!prev) {
              return [newCard];
            }
            return [...prev, newCard];
          },
        );
      },
    },
  );
};
