import { FormEventHandler, useState } from "react";
import { toast } from "react-toastify";
import { useUpdatePassword } from "#/api/mutations/profile/updatePassword";
import { Button } from "#/components/Button";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";

export const PasswordSettings = () => {
  const { mutateAsync: updatePassword, isLoading } = useUpdatePassword();
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  useWarnUnsavedChanges(Boolean(password || confirmedPassword || isLoading));

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (password && password !== confirmedPassword) {
      toast.error("The entered passwords do not match", { toastId: "password-match" });
      return;
    }
    await updatePassword({ updatedPassword: password });
    setPassword("");
    setConfirmedPassword("");
  };

  return (
    <Stack as="form" onSubmit={onSubmit} css={{ p: "$6", gap: "$6" }}>
      <MainTitle as="h2">Password</MainTitle>
      <Stack css={{ gap: "$5" }}>
        <Stack as="label" css={{ gap: "$4" }}>
          <Body css={{ color: "$secondaryText" }}>New Password</Body>
          <Input
            size="md"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </Stack>
        <Stack as="label" css={{ gap: "$4" }}>
          <Body css={{ color: "$secondaryText" }}>Confirm New Password</Body>
          <Input
            size="md"
            required
            type="password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.currentTarget.value)}
          />
        </Stack>
      </Stack>
      <Button disabled={!password || !confirmedPassword || isLoading}>
        <TextOrSpinner isLoading={isLoading}>Update Password</TextOrSpinner>
      </Button>
    </Stack>
  );
};
