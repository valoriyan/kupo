import { useState } from "react";
import { Button } from "#/components/Button";
import { ModalFooter, openModal, StandardModalWrapper } from "#/components/Modal";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";

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
    <StandardModalWrapper>
      <MainTitle>Remove Card?</MainTitle>
      <Body css={{ color: "$secondaryText" }}>
        Are you sure you would like to remove this card?
      </Body>
      <ModalFooter>
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
      </ModalFooter>
    </StandardModalWrapper>
  );
};
