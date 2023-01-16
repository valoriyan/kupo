import { FormEventHandler, useEffect, useState } from "react";
import { useUpdateOwnProfile } from "#/api/mutations/profile/updateOwnProfile";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";

export interface ContactInfoSettingsProps {
  currentEmail: string | undefined;
}

export const ContactInfoSettings = ({ currentEmail }: ContactInfoSettingsProps) => {
  const { mutateAsync: updateProfile, isLoading } = useUpdateOwnProfile();
  const [newEmail, setNewEmail] = useState<string>("");

  useWarnUnsavedChanges((newEmail && currentEmail !== newEmail) || isLoading);

  useEffect(() => {
    if (currentEmail) {
      setNewEmail(currentEmail);
    }
  }, [currentEmail]);

  const isDisabled = !newEmail || currentEmail === newEmail || isLoading;

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    // TODO: Validate that newEmail is actually an email address
    updateProfile({ userEmail: newEmail });
  };

  return (
    <Stack as="form" onSubmit={onSubmit} css={{ p: "$6", gap: "$6" }}>
      <MainTitle as="h2">Contact Info</MainTitle>
      <Stack as="label" css={{ gap: "$4" }}>
        <Body css={{ color: "$secondaryText" }}>Email</Body>
        <Input
          size="md"
          required
          type="email"
          placeholder="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.currentTarget.value)}
        />
      </Stack>
      <Button disabled={isDisabled}>
        <TextOrSpinner isLoading={isLoading}>Update Contact Info</TextOrSpinner>
      </Button>
    </Stack>
  );
};
