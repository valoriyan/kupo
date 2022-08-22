import { useState } from "react";
import { Button } from "#/components/Button";
import { Flex, Stack } from "#/components/Layout";
import { openModal } from "#/components/Modal";
import { Body, MainTitle } from "#/components/Typography";
import { TextOrSpinner } from "#/components/TextOrSpinner";

export const openRemoveCardModal = (args: Omit<RemoveCardModalProps, "hide">) => {
  openModal({
    id: "Remove Card Modal",
    children: ({ hide }) => <RemoveCardModal hide={hide} {...args} />,
  });
};

export interface RemoveCardModalProps {
  removeCreditCard: () => Promise<void>;
  hide: () => void;
}

export const RemoveCardModal = ({ removeCreditCard, hide }: RemoveCardModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Stack
      css={{
        gap: "$6",
        px: "$7",
        py: "$6",
        bg: "$modalBackground",
        borderRadius: "$2",
        boxShadow: "$3",
      }}
    >
      <MainTitle>Remove Card?</MainTitle>
      <Body>Are you sure you would like to remove this card?</Body>
      <Flex css={{ justifyContent: "flex-end", gap: "$3" }}>
        <Button variant="secondary" onClick={hide}>
          Cancel
        </Button>
        <Button
          variant="danger"
          css={{ whiteSpace: "nowrap" }}
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              await removeCreditCard();
            } catch {
              setIsLoading(false);
              return;
            }
            hide();
          }}
        >
          <TextOrSpinner isLoading={isLoading}>Remove Card</TextOrSpinner>
        </Button>
      </Flex>
    </Stack>
  );
};
