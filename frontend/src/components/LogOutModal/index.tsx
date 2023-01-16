import { logout } from "#/contexts/auth";
import { Button } from "../Button";
import { Flex } from "../Layout";
import { openModal, StandardModalWrapper } from "../Modal";
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
      <Body>Are you sure you would like to log out?</Body>
      <Flex css={{ justifyContent: "flex-end", gap: "$3" }}>
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
      </Flex>
    </StandardModalWrapper>
  );
};
