import { useEffect } from "react";
import { useGetPageOfOldNotifications } from "#/api/queries/notifications/useGetPageOfOldNotifications";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { BasicListHeader, BasicListWrapper } from "#/components/BasicList";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteScrollArea } from "#/components/InfiniteScrollArea";
import { LoadingArea } from "#/components/LoadingArea";
import { Notification } from "./Notification";

export const Notifications = () => {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPageOfOldNotifications();
  const { markAllNotificationsAsSeen } = useWebsocketState();

  useEffect(() => {
    if (!!data && !error && !isLoading) {
      console.log("HIT!");
      markAllNotificationsAsSeen();
    }
  }, [data, error, isLoading, markAllNotificationsAsSeen]);

  // markAllNotificationsAsSeen();

  const oldNotifications = data?.pages.flatMap((page) => page.userNotifications);

  return (
    <BasicListWrapper>
      <BasicListHeader>Notifications</BasicListHeader>
      <div>
        {error && !isLoading ? (
          <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>
        ) : isLoading || !oldNotifications ? (
          <LoadingArea size="lg" />
        ) : !oldNotifications.length ? (
          <ErrorMessage>You&apos;re all caught up!</ErrorMessage>
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
    </BasicListWrapper>
  );
};
