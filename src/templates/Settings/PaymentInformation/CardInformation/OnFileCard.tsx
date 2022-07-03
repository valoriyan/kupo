import { Button } from "#/components/Button";
import { Flex, Stack } from "#/components/Layout";
import { Body, Subtext } from "#/components/Typography";
import { styled } from "#/styling";

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
  cardInfo: CardInfo;
  makePrimaryCard: () => void;
  deleteCard: () => void;
}

export const OnFileCard = ({
  cardInfo,
  makePrimaryCard,
  deleteCard,
}: OnFileCardProps) => {
  return (
    <Wrapper isPrimary={cardInfo.isPrimaryCard}>
      <Stack css={{ gap: "$4" }}>
        <Stack css={{ gap: "$1" }}>
          <Flex css={{ justifyContent: "space-between" }}>
            <Body>
              <strong>{cardInfo.cardIssuer}</strong> ****{cardInfo.lastFourDigits}
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
            <Button size="sm" variant="secondary" outlined onClick={makePrimaryCard}>
              Make Primary
            </Button>
          )}
          <Button size="sm" variant="danger" outlined onClick={deleteCard}>
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
