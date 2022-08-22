import { useGetClientUserProfile } from "#/api/queries/users/useGetClientUserProfile";
import { ErrorArea } from "#/components/ErrorArea";
import { Box, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { ContactInfoSettings } from "./ContactInfoSettings";
import { PasswordSettings } from "./PasswordSettings";

export const Account = () => {
  const { data, isLoading, error } = useGetClientUserProfile();

  if (error && !isLoading) {
    return <ErrorArea>Failed to fetch profile settings</ErrorArea>;
  }

  if (isLoading || !data) {
    return <LoadingArea size="lg" />;
  }

  return (
    <Stack css={{ gap: "$3" }}>
      <ContactInfoSettings currentEmail={data?.email} />
      <Box css={{ height: "1px", bg: "$border" }} />
      <PasswordSettings />
    </Stack>
  );
};
