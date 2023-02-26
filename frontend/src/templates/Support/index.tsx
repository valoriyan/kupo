import { useState } from "react";
import { Button } from "#/components/Button";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { Input } from "#/components/Input";
import { Stack } from "#/components/Layout";
import { TextArea } from "#/components/TextArea";
import { Body } from "#/components/Typography";
import { useCurrentUserId } from "#/contexts/auth";
import { styled } from "#/styling";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";

const SUPPORT_EMAIL = "support@kupo.social";

export const Support = () => {
  const userId = useCurrentUserId();

  const [userSubject, setUserSubject] = useState("");
  const [userDescription, setUserDescription] = useState("");

  const clearWarning = useWarnUnsavedChanges(Boolean(userSubject || userDescription));

  const subject = `[KUPO SUPPORT] ${userSubject}`;
  const description = `${userDescription}\n\n-- Additional Information --\nUser ID: ${
    userId ?? "Guest"
  }`;

  const mailTo = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(description)}`;

  return (
    <StandardPageLayout heading="Support">
      <Stack css={{ p: "$6", gap: "$7" }}>
        <Body>
          Hello! If you&apos;re experiencing any issues with Kupo, please describe the
          issue below and submit the form to send us an email. We&apos;ll do our best to
          resolve your issue promptly.
        </Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            clearWarning();
            window.open(mailTo);
          }}
        >
          <Input
            type="text"
            autoComplete="off"
            required
            label="Subject"
            size="lg"
            value={userSubject}
            onChange={(e) => setUserSubject(e.currentTarget.value)}
          />
          <TextArea
            autoComplete="off"
            required
            rows={4}
            label="Description"
            size="lg"
            value={userDescription}
            onChange={(e) => setUserDescription(e.currentTarget.value)}
          />
          <Button type="submit">Send Email</Button>
        </Form>
      </Stack>
    </StandardPageLayout>
  );
};

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$5",
});
