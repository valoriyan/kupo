import { useState } from "react";
import { Button } from "#/components/Button";
import { ErrorMessage } from "#/components/ErrorArea";
import { MathPlusIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { Spinner } from "#/components/Spinner";
import { Body } from "#/components/Typography";
import { CardInfo, OnFileCard } from "./OnFileCard";

export const CardInformation = () => {
  return (
    <Stack css={{ gap: "$5" }}>
      <Body as="p" css={{ color: "$secondaryText" }}>
        Cards are required to make any purchases or subscribe to any user.
      </Body>
      <Stack css={{ gap: "$4" }}>
        <CardList />
        <Button css={{ gap: "$2" }}>
          <MathPlusIcon /> <div>Add Card</div>
        </Button>
      </Stack>
    </Stack>
  );
};

const CardList = () => {
  const [cards, setCards] = useState<CardInfo[]>(testCards);
  const isLoading = false;
  const isError = false;

  if (isError && !isLoading) {
    return (
      <ErrorMessage css={{ fontSize: "$3" }}>Failed to load your cards</ErrorMessage>
    );
  }

  if (isLoading || !cards) {
    return (
      <Flex css={{ p: "$6", justifyContent: "center" }}>
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (!cards.length) {
    return <ErrorMessage css={{ fontSize: "$3" }}>No cards on file yet</ErrorMessage>;
  }

  return (
    <>
      {cards.map((card) => (
        <OnFileCard
          key={card.id}
          cardInfo={card}
          makePrimaryCard={() => {}}
          deleteCard={() => setCards((prev) => prev.filter((c) => c.id !== card.id))}
        />
      ))}
    </>
  );
};

const testCards: CardInfo[] = [
  {
    id: "1",
    cardIssuer: "Visa",
    lastFourDigits: "4242",
    cardholderName: "Blake Zimmerman",
    expMonth: 12,
    expYear: 2025,
    isPrimaryCard: true,
  },
  {
    id: "2",
    cardIssuer: "American Express",
    lastFourDigits: "6969",
    cardholderName: "Blake Zimmerman",
    expMonth: 1,
    expYear: 2024,
    isPrimaryCard: false,
  },
];
