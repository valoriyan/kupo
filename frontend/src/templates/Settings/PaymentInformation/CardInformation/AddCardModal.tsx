import { FormEvent, useEffect, useState } from "react";
import { useStoreCreditCard } from "#/api/mutations/payment/storeCreditCard";
import { Button } from "#/components/Button";
import { Flex, Grid, Stack } from "#/components/Layout";
import { openModal, StandardModalWrapper } from "#/components/Modal";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle, subtextStyles } from "#/components/Typography";
import { ComponentGroup, useSecurion } from "#/contexts/securion";
import { styled } from "#/styling";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";

export const openAddCardModal = (args?: Omit<AddCardModalProps, "hide">) => {
  openModal({
    id: "Add Card Modal",
    children: ({ hide }) => <AddCardModal hide={hide} {...args} />,
  });
};

export interface AddCardModalProps {
  hide: () => void;
}

export const AddCardModal = (props: AddCardModalProps) => {
  const securion = useSecurion((store) => store.securion);
  const [formComponents, setFormComponents] = useState<ComponentGroup>();
  const [cardholderName, setCardholderName] = useState("");
  const { mutateAsync: storeCreditCard } = useStoreCreditCard();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (securion && !formComponents) {
      setFormComponents(securion.createComponentGroup().automount("#payment-form"));
    }
  }, [securion, formComponents]);

  useWarnUnsavedChanges(!!cardholderName || isLoading);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrorMessage(undefined);
    if (securion && formComponents) {
      try {
        const token = await securion.createToken(formComponents, { cardholderName });
        await storeCreditCard({
          token: token.id,
          last4: token.last4.toString(),
          expMonth: token.expMonth.toString(),
          expYear: token.expYear.toString(),
          cardholderName: token.cardholderName ?? "",
          brand: token.brand,
        });
        props.hide();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setErrorMessage(error?.message ?? "");
      }
    }
    setIsLoading(false);
  };

  return (
    <StandardModalWrapper css={{ gap: "$5" }}>
      <MainTitle>Add a new card</MainTitle>
      <Body css={{ color: "$secondaryText", mb: "$3" }}>
        Your card information will be securely handled <br />
        by our payment processor{" "}
        <a href="https://securionpay.com/" target="_blank" rel="noopener noreferrer">
          SecurionPay
        </a>
        .
      </Body>
      {errorMessage !== undefined && (
        <Flex css={{ p: "$3", borderRadius: "$2", bg: "$failure", color: "$accentText" }}>
          {errorMessage ?? "An error occurred"}
        </Flex>
      )}
      <form id="payment-form" onSubmit={onSubmit}>
        <Stack css={{ gap: "$5" }}>
          <div>
            <Label>Cardholder Name</Label>
            <Input
              required
              value={cardholderName}
              onChange={(e) => setCardholderName(e.currentTarget.value)}
            />
          </div>

          <div>
            <Label>Card Number</Label>
            <FormField>
              <div data-securionpay="number"></div>
            </FormField>
          </div>

          <Grid css={{ gridTemplateColumns: "1fr 1fr", columnGap: "$6" }}>
            <div>
              <Label>Expiration</Label>
              <FormField>
                <div data-securionpay="expiry"></div>
              </FormField>
            </div>
            <div>
              <Label>CVC</Label>
              <FormField>
                <div data-securionpay="cvc"></div>
              </FormField>
            </div>
          </Grid>

          <Flex css={{ justifyContent: "flex-end", gap: "$3", mt: "$3" }}>
            <Button type="button" variant="secondary" onClick={props.hide}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              css={{ whiteSpace: "nowrap" }}
              disabled={isLoading}
            >
              <TextOrSpinner isLoading={isLoading}>Save Card</TextOrSpinner>
            </Button>
          </Flex>
        </Stack>
      </form>
    </StandardModalWrapper>
  );
};

const Label = styled("label", subtextStyles, {
  pb: "$3",
});

const Input = styled("input", {
  display: "block",
  width: "100%",
  bg: "white", // TODO switch to $background2 when styling the payment inputs is possible
  color: "black", // TODO remove this when styling the payment inputs is possible
  colorScheme: "light", // TODO remove this when styling the payment inputs is possible
  border: "solid $borderWidths$1 $border",
  borderRadius: "$2",
  p: "$3",
  mt: "$2",

  "&:focus": {
    outline: "none",
    borderColor: "$primary",
  },
});

const FormField = styled("div", {
  bg: "white", // TODO switch to $background2 when styling the payment inputs is possible
  border: "solid $borderWidths$1 $border",
  borderRadius: "$2",
  p: "$3",
  mt: "$2",

  "&:focus-within": {
    outline: "none",
    borderColor: "$primary",
  },
});
