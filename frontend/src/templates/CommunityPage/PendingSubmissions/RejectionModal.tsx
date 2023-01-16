import { useState } from "react";
import {
  GetPublishingChannelSubmissionsSuccessPublishedSubmissions,
  PublishingChannelSubmissionDecision,
} from "#/api";
import { useResolvePendingCommunitySubmission } from "#/api/mutations/community/resolvePendingCommunitySubmission";
import { Button, IconButton } from "#/components/Button";
import { CloseIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { openModal, StandardModalWrapper } from "#/components/Modal";
import { RadioGroup } from "#/components/RadioGroup";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Heading, MainTitle } from "#/components/Typography";

export const openRejectionModal = (props: Omit<RejectionModalProps, "hide">) =>
  openModal({
    id: "Community Post Rejection Modal",
    children: ({ hide }) => <RejectionModal hide={hide} {...props} />,
  });

interface RejectionModalProps {
  publishingChannelName: string;
  publishingChannelRules: string[];
  submission: GetPublishingChannelSubmissionsSuccessPublishedSubmissions;
  hide: () => void;
}

export const RejectionModal = ({
  publishingChannelName,
  publishingChannelRules,
  submission,
  hide,
}: RejectionModalProps) => {
  const { mutateAsync: resolvePendingSubmission, isLoading: isResolvingSubmission } =
    useResolvePendingCommunitySubmission(publishingChannelName);

  const [selectedRule, setSelectedRule] = useState<string>();

  const rejectPost = async () => {
    if (!selectedRule) return;
    try {
      await resolvePendingSubmission({
        publishingChannelSubmissionId: submission.submissionId,
        decision: PublishingChannelSubmissionDecision.Reject,
        reasonString: selectedRule,
      });
      hide();
    } catch {
      // Leave modal open so they can try again
    }
  };

  return (
    <StandardModalWrapper>
      <Flex css={{ justifyContent: "space-between", alignItems: "center", gap: "$3" }}>
        <MainTitle>Reject Post?</MainTitle>
        <IconButton onClick={hide}>
          <CloseIcon />
        </IconButton>
      </Flex>
      <Stack css={{ gap: "$6" }}>
        <Heading>Select the community rule that this post violates:</Heading>
        <RadioGroup
          ariaLabel="Community Rules"
          value={selectedRule}
          onChange={(rule) => setSelectedRule(rule)}
          options={publishingChannelRules.map((r) => ({ value: r, label: r }))}
        />
      </Stack>
      <Flex css={{ justifyContent: "flex-end", gap: "$3" }}>
        <Button variant="secondary" onClick={hide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={rejectPost} disabled={isResolvingSubmission}>
          <TextOrSpinner isLoading={isResolvingSubmission}>Reject Post</TextOrSpinner>
        </Button>
      </Flex>
    </StandardModalWrapper>
  );
};
