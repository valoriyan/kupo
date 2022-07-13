import { useMakeCreditCardPrimary } from "#/api/mutations/payment/makeCreditCardPrimary";
import { useRemoveCreditCard } from "#/api/mutations/payment/removeCreditCard";
import { useGetCreditCardsByUserId } from "#/api/queries/payment/getCreditCardsByUserId";
import { Button } from "#/components/Button";
import { ErrorMessage } from "#/components/ErrorArea";
import { MathPlusIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { Spinner } from "#/components/Spinner";
import { Body } from "#/components/Typography";
import { openAddCardModal } from "./AddCardModal";
import { OnFileCard } from "./OnFileCard";

export const CardInformation = () => {
  return (
    <Stack css={{ gap: "$5" }}>
      <Body as="p" css={{ color: "$secondaryText" }}>
        Cards are required to make any purchases or subscribe to any user.
      </Body>
      <Stack css={{ gap: "$4" }}>
        <CardList />
        <Button css={{ gap: "$2" }} onClick={openAddCardModal}>
          <MathPlusIcon /> <div>Add Card</div>
        </Button>
      </Stack>
    </Stack>
  );
};

const CardList = () => {
  const { data, isLoading, isError } = useGetCreditCardsByUserId();
  const { mutateAsync: makeCreditCardPrimary } = useMakeCreditCardPrimary();
  const { mutateAsync: removeCreditCard } = useRemoveCreditCard();

  if (isError && !isLoading) {
    return (
      <ErrorMessage css={{ fontSize: "$3" }}>Failed to load your cards</ErrorMessage>
    );
  }

  if (isLoading || !data) {
    return (
      <Flex css={{ p: "$6", justifyContent: "center" }}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!data.length) {
    return <ErrorMessage css={{ fontSize: "$3" }}>No cards on file yet</ErrorMessage>;
  }

  return (
    <>
      {data.map((card) => (
        <OnFileCard
          key={card.localCreditCardId}
          cardInfo={card}
          makePrimaryCard={() => makeCreditCardPrimary(card.localCreditCardId)}
          deleteCard={() => removeCreditCard(card.localCreditCardId)}
        />
      ))}
    </>
  );
};
