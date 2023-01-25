import { useEffect } from "react";
import { useResendVerificationEmail } from "#/api/mutations/profile/resendVerificationEmail";
import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { SessionStorageItem } from "#/utils/storage";
import { Button } from "../Button";
import { Stack } from "../Layout";
import { ModalFooter, openModal, StandardModalWrapper } from "../Modal";
import { TextOrSpinner } from "../TextOrSpinner";
import { Body, MainTitle } from "../Typography";

const storedHasRemindedVerifyEmail = SessionStorageItem<boolean>(
  "hasRemindedVerifyEmail",
);

export const useVerifyEmailReminder = () => {
  const { hasNotVerifiedEmail, emailAddress } = useVerifyEmailState();

  useEffect(() => {
    if (hasNotVerifiedEmail && emailAddress && !storedHasRemindedVerifyEmail.get()) {
      openVerifyEmailModal({ emailAddress });
      storedHasRemindedVerifyEmail.set(true);
    }
  }, [hasNotVerifiedEmail, emailAddress]);
};

export const useVerifyEmailState = () => {
  const { data: clientUser } = useGetClientUserProfile();

  const hasNotVerifiedEmail = clientUser?.hasVerifiedEmail === false;
  const emailAddress = clientUser?.email;

  return { hasNotVerifiedEmail, emailAddress, clientUser };
};

export type VerifyEmailState = ReturnType<typeof useVerifyEmailState>;

export const openVerifyEmailModal = (args: Omit<VerifyEmailModalProps, "hide">) => {
  openModal({
    id: "Verify Email Modal",
    children: ({ hide }) => <VerifyEmailModal hide={hide} {...args} />,
  });
};

interface VerifyEmailModalProps {
  emailAddress: string;
  hide: () => void;
}

const VerifyEmailModal = ({ emailAddress, hide }: VerifyEmailModalProps) => {
  const { mutateAsync: resendEmail, isLoading } = useResendVerificationEmail();

  return (
    <StandardModalWrapper>
      <MainTitle>Verify Your Email</MainTitle>
      <Stack css={{ gap: "$3" }}>
        <Body css={{ color: "$secondaryText" }}>
          In order to post content, you&apos;ll need to verify your email address.
        </Body>
        <Body css={{ color: "$secondaryText", mt: "$3" }}>
          We sent a verification link to <strong>{emailAddress}</strong>.
        </Body>
        <Body css={{ color: "$secondaryText" }}>
          If you don&apos;t see the email after a few minutes, trying checking your spam
          folder.
        </Body>
      </Stack>
      <ModalFooter>
        <Button variant="secondary" onClick={hide}>
          Dismiss
        </Button>
        <Button
          variant="primary"
          css={{ whiteSpace: "nowrap" }}
          onClick={async () => {
            await resendEmail();
            hide();
          }}
        >
          <TextOrSpinner isLoading={isLoading}>Resend Email</TextOrSpinner>
        </Button>
      </ModalFooter>
    </StandardModalWrapper>
  );
};
