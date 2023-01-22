import { logout } from "#/contexts/auth";
import { Button } from "../Button";
import { ModalFooter, openModal, StandardModalWrapper } from "../Modal";
import { Body, MainTitle } from "../Typography";

export const openLogOutModal = (args?: Omit<LogOutModalProps, "hide">) => {
  openModal({
    id: "Log Out Modal",
    children: ({ hide }) => <LogOutModal hide={hide} {...args} />,
  });
};

export interface LogOutModalProps {
  onLogout?: () => void;
  hide: () => void;
}

export const LogOutModal = ({ onLogout, hide }: LogOutModalProps) => {
  return (
    <StandardModalWrapper>
      <MainTitle>Log Out</MainTitle>
      <Body css={{ color: "$secondaryText" }}>
        Are you sure you would like to log out?
      </Body>
      <ModalFooter>
        <Button variant="secondary" onClick={hide}>
          Cancel
        </Button>
        <Button
          variant="danger"
          css={{ whiteSpace: "nowrap" }}
          onClick={() => {
            logout();
            onLogout?.();
            hide();
          }}
          data-cy="logout-modal-button"
        >
          Log Out
        </Button>
      </ModalFooter>
    </StandardModalWrapper>
  );
};
