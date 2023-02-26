import { PublishingChannelSubmissionDecision } from "#/api";
import { useResolvePendingCommunitySubmission } from "#/api/mutations/community/resolvePendingCommunitySubmission";
import { useGetPendingSubmissions } from "#/api/queries/community/useGetPendingSubmissions";
import { Button } from "#/components/Button";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
import { Flex, Stack } from "#/components/Layout";
import { LoadingArea } from "#/components/LoadingArea";
import { Post } from "#/components/Post";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Tooltip } from "#/components/Tooltip";
import { goToPostPage } from "#/templates/SinglePost";
import { openRejectionModal } from "./RejectionModal";

export interface PendingSubmissionsProps {
  publishingChannelId: string;
  publishingChannelName: string;
  publishingChannelRules: string[];
}

export const PendingSubmissions = ({
  publishingChannelId,
  publishingChannelName,
  publishingChannelRules,
}: PendingSubmissionsProps) => {
  const { data, isLoading, error, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetPendingSubmissions(publishingChannelId);
  const { mutateAsync: resolvePendingSubmission, isLoading: isResolvingSubmission } =
    useResolvePendingCommunitySubmission(publishingChannelName);

  if (!!error && !isLoading) {
    return (
      <ErrorMessage>{error.data?.error?.reason ?? "An error occurred"}</ErrorMessage>
    );
  }

  if (isLoading || !data) {
    return <LoadingArea size="lg" />;
  }

  const submissions = data.pages.flatMap((page) => page.publishedSubmissions);

  return submissions.length === 0 ? (
    <ErrorMessage>No Pending Submissions Found</ErrorMessage>
  ) : (
    <InfiniteList
      hasNextPage={hasNextPage ?? false}
      isNextPageLoading={isFetchingNextPage}
      loadNextPage={fetchNextPage}
      data={submissions}
      renderItem={(index, submission) => (
        <Stack
          key={submission.submissionId}
          css={{ borderBottom: "solid $borderWidths$1 $border" }}
        >
          <Post
            post={submission.publishedItem}
            handleClickOfCommentsButton={() => goToPostPage(submission.publishedItem.id)}
            borderLess
          />
          <Flex css={{ gap: "$4", px: "$4", pb: "$5", "> *": { flex: 1 } }}>
            <Tooltip
              disabled={!!publishingChannelRules.length}
              content={
                <>
                  You cannot reject posts until you
                  <br />
                  set up rules for your community.
                </>
              }
            >
              <Button
                size="lg"
                variant="danger"
                outlined
                disabled={!publishingChannelRules.length}
                onClick={() =>
                  openRejectionModal({
                    publishingChannelName,
                    publishingChannelRules,
                    submission,
                  })
                }
                css={{ width: "100%" }}
              >
                Reject
              </Button>
            </Tooltip>
            <Button
              size="lg"
              variant="secondary"
              disabled={isResolvingSubmission}
              onClick={() =>
                resolvePendingSubmission({
                  publishingChannelSubmissionId: submission.submissionId,
                  decision: PublishingChannelSubmissionDecision.Accept,
                  reasonString: "",
                })
              }
            >
              <TextOrSpinner size="lg" isLoading={isResolvingSubmission}>
                Accept
              </TextOrSpinner>
            </Button>
          </Flex>
        </Stack>
      )}
    />
  );
};
