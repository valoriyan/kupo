import { useState } from "react";
import { CreditCardSummary } from "#/api";
import { Button } from "#/components/Button";
import { Flex, Stack } from "#/components/Layout";
import { Body, Subtext } from "#/components/Typography";
import { styled } from "#/styling";
import { openRemoveCardModal } from "./RemoveCardModal";

export interface CardInfo {
  id: string;
  cardIssuer: string;
  lastFourDigits: string;
  cardholderName: string;
  expMonth: number;
  expYear: number;
  isPrimaryCard: boolean;
}

export interface OnFileCardProps {
  cardInfo: CreditCardSummary;
  makePrimaryCard: () => Promise<void>;
  removeCreditCard: () => Promise<void>;
}

export const OnFileCard = ({
  cardInfo,
  makePrimaryCard,
  removeCreditCard,
}: OnFileCardProps) => {
  const [isMakingPrimary, setIsMakingPrimary] = useState(false);

  return (
    <Wrapper isPrimary={cardInfo.isPrimaryCard}>
      <Stack css={{ gap: "$4" }}>
        <Stack css={{ gap: "$1" }}>
          <Flex css={{ justifyContent: "space-between" }}>
            <Body>
              <strong>{cardInfo.brand}</strong> ****{cardInfo.last4}
            </Body>
            {cardInfo.isPrimaryCard && (
              <Body css={{ color: "$secondary", fontWeight: "bold" }}>Primary</Body>
            )}
          </Flex>
          <Subtext>{cardInfo.cardholderName}</Subtext>
          <Subtext css={{ color: "$secondaryText" }}>
            exp. {cardInfo.expMonth}/{cardInfo.expYear}
          </Subtext>
        </Stack>
        <Flex css={{ gap: "$4", justifyContent: "flex-end" }}>
          {!cardInfo.isPrimaryCard && (
            <Button
              size="sm"
              variant="secondary"
              outlined
              disabled={isMakingPrimary}
              onClick={async () => {
                setIsMakingPrimary(true);
                try {
                  await makePrimaryCard();
                  setIsMakingPrimary(false);
                } catch {
                  setIsMakingPrimary(false);
                }
              }}
            >
              Make Primary
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            outlined
            onClick={() =>
              openRemoveCardModal({
                removeCreditCard: async () => {
                  await removeCreditCard();
                },
              })
            }
          >
            Remove
          </Button>
        </Flex>
      </Stack>
    </Wrapper>
  );
};

const Wrapper = styled(Stack, {
  px: "$5",
  py: "$4",
  gap: "$4",
  borderRadius: "$3",
  border: "solid $borderWidths$2 $border",
  color: "$border",
  transition: "border-color $1 ease, color $1 ease",

  variants: {
    isPrimary: { true: { borderColor: "$primary", color: "inherit" } },
  },
});
