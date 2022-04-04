import { useGetPageOfOldNotifications } from "#/api/queries/notifications/useGetPageOfOldNotifications";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { LoadingArea } from "#/components/LoadingArea";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { Notification } from "./Notification";

export const Notifications = () => {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPageOfOldNotifications();

  const oldNotifications = data?.pages.flatMap((page) => page.userNotifications);

  return (
    <Wrapper>
      <Header>
        <MainTitle as="h1">Notifications</MainTitle>
      </Header>
      <div>
        {error && !isLoading ? (
          <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>
        ) : isLoading || !oldNotifications ? (
          <LoadingArea size="lg" />
        ) : (
          <InfiniteScrollArea
            hasNextPage={hasNextPage ?? false}
            isNextPageLoading={isFetchingNextPage}
            loadNextPage={fetchNextPage}
            items={oldNotifications.map((notification, index) => (
              <Notification key={index} notification={notification} />
            ))}
          />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100%",
});

const Header = styled("div", {
  display: "flex",
  px: "$6",
  py: "$5",
  gap: "$5",
  borderBottom: "solid $borderWidths$1 $text",
});
