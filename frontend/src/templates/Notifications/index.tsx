import { useEffect } from "react";
import { useGetPageOfOldNotifications } from "#/api/queries/notifications/useGetPageOfOldNotifications";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { StandardPageLayout } from "#/components/StandardPageLayout";
import { ErrorMessage } from "#/components/ErrorArea";
import { InfiniteList } from "#/components/InfiniteList";
import { LoadingArea } from "#/components/LoadingArea";
import { Notification } from "./Notification";

export const Notifications = () => {
  const { data, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPageOfOldNotifications();
  const { markAllNotificationsAsSeen } = useWebsocketState();

  useEffect(() => {
    if (!!data && !error && !isLoading) {
      markAllNotificationsAsSeen();
    }
  }, [data, error, isLoading, markAllNotificationsAsSeen]);

  const oldNotifications = data?.pages.flatMap((page) => page.userNotifications);

  return (
    <StandardPageLayout heading="Notifications">
      {error && !isLoading ? (
        <ErrorMessage>{error.message || "An error occurred"}</ErrorMessage>
      ) : isLoading || !oldNotifications ? (
        <LoadingArea size="lg" />
      ) : !oldNotifications.length ? (
        <ErrorMessage>You&apos;re all caught up!</ErrorMessage>
      ) : (
        <InfiniteList
          hasNextPage={hasNextPage ?? false}
          isNextPageLoading={isFetchingNextPage}
          loadNextPage={fetchNextPage}
          data={oldNotifications}
          renderItem={(index, notification) => (
            <Notification key={index} notification={notification} />
          )}
        />
      )}
    </StandardPageLayout>
  );
};
