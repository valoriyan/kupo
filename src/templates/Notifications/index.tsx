import { useGetPageOfOldNotifications } from "#/api/queries/notifications/useGetPageOfOldNotifications";
import { Notification } from "./Notification";

export const Notifications = () => {
  const {
    data,
    isError,
    isLoading,
    error,
    isFetching: isFetchingChatMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPageOfOldNotifications();

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const oldNotifications = data?.pages.flatMap((page) => page.userNotifications);

  return (
    <div>
      {isFetchingChatMessages ? (
        <div>
          Refreshing...
          <br />
        </div>
      ) : null}

      {oldNotifications.map((notification, index) => (
        <Notification key={index} notification={notification} />
      ))}

      {/* {notificationsReceived.map((notificationReceived, index) => (
        <Notification key={index} notification={notificationReceived} />
      ))} */}

      <button
        onClick={() => {
          fetchNextPage();
        }}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? (
          "Loading more..."
        ) : hasNextPage ? (
          <h3>Load Next</h3>
        ) : (
          "Nothing more to load"
        )}
      </button>
    </div>
  );
};
