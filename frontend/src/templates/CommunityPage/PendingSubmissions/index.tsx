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
import { goToPostPage } from "#/templates/SinglePost";

export interface PendingSubmissionsProps {
  publishingChannelId: string;
  publishingChannelName: string;
}

export const PendingSubmissions = ({
  publishingChannelId,
  publishingChannelName,
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
    return (
      <Flex css={{ p: "$6" }}>
        <LoadingArea size="lg" />
      </Flex>
    );
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
            <Button
              size="lg"
              variant="danger"
              outlined
              disabled={isResolvingSubmission}
              onClick={() =>
                resolvePendingSubmission({
                  publishingChannelSubmissionId: submission.submissionId,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  decision: PublishingChannelSubmissionDecision.Reject as any,
                  reasonString: "",
                })
              }
            >
              <TextOrSpinner size="lg" isLoading={isResolvingSubmission}>
                Reject
              </TextOrSpinner>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              disabled={isResolvingSubmission}
              onClick={() =>
                resolvePendingSubmission({
                  publishingChannelSubmissionId: submission.submissionId,
                  decision: PublishingChannelSubmissionDecision.Accept,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any)
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
