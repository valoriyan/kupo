import { FormEvent, useEffect, useState } from "react";
import { Button } from "#/components/Button";
import { Flex, Grid, Stack } from "#/components/Layout";
import { openModal } from "#/components/Modal";
import { Body, MainTitle, subtextStyles } from "#/components/Typography";
import { ComponentGroup, useSecurion } from "#/contexts/securion";
import { styled } from "#/styling";
import { useStoreCreditCard } from "#/api/mutations/payment/storeCreditCard";
import { TextOrSpinner } from "#/components/TextOrSpinner";

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

  useEffect(() => {
    if (securion && !formComponents) {
      setFormComponents(securion.createComponentGroup().automount("#payment-form"));
    }
  }, [securion, formComponents]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    if (securion && formComponents) {
      try {
        const token = await securion.createToken(formComponents, { cardholderName });
        await storeCreditCard(token.id);
        props.hide();
      } catch (error) {
        // TODO: Put error at top of form
        console.log("Failed to store credit card", error);
      }
    }
    setIsLoading(false);
  };

  return (
    <Stack
      css={{
        gap: "$5",
        px: "$7",
        py: "$6",
        bg: "$modalBackground",
        borderRadius: "$2",
        boxShadow: "$3",
      }}
    >
      <MainTitle>Add a new card</MainTitle>
      <Body css={{ color: "$secondaryText", mb: "$3" }}>
        Please enter your card information below
      </Body>
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
    </Stack>
  );
};

const Label = styled("label", subtextStyles, {
  pb: "$3",
});

const Input = styled("input", {
  display: "block",
  width: "100%",
  bg: "$background2",
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
  bg: "$background2",
  border: "solid $borderWidths$1 $border",
  borderRadius: "$2",
  p: "$3",
  mt: "$2",

  "&:focus-within": {
    outline: "none",
    borderColor: "$primary",
  },
});
