import { NOTIFICATIONEVENTS } from "#/api";
import { useGetPageOfOldNotifications } from "#/api/queries/notifications/useGetPageOfOldNotifications";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { NewCommentOnPostNotification } from "./NewCommentOnPostNotification";
import { NewFollowerNotification } from "./NewFollowerNotification";
import { NewLikeOnPostNotification } from "./NewLikeOnPostNotification";

export const Notifications = () => {
  const { notificationsReceived } = useWebsocketState();

  const {
    data,
    isError,
    isLoading,
    error,
    isFetching: isFetchingChatMessages,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useGetPageOfOldNotifications();

  if (isError && !isLoading) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (isLoading || !data) {
    return <div>Loading</div>;
  }

  const renderedOldNotifications = data?.pages.flatMap((page) => {
    return page.userNotifications.map((notification) => {
      const { type } = notification;

      if (type === NOTIFICATIONEVENTS.NewFollower) {
        return <NewFollowerNotification notification={notification} />;
      } else if (type === NOTIFICATIONEVENTS.NewCommentOnPost) {
        return <NewCommentOnPostNotification notification={notification} />;
      } else if (type === NOTIFICATIONEVENTS.NewLikeOnPost) {
        return <NewLikeOnPostNotification notification={notification} />;
      }
    });
  });

  return (
    <div>
      <button
        onClick={() => {
          fetchPreviousPage();
        }}
        disabled={!hasPreviousPage || isFetchingPreviousPage}
      >
        {isFetchingPreviousPage ? (
          "Loading more..."
        ) : hasPreviousPage ? (
          <h3>LOAD PREVIOUS</h3>
        ) : (
          "Nothing more to load"
        )}
      </button>
      {isFetchingChatMessages ? (
        <div>
          Refreshing...
          <br />
        </div>
      ) : null}

      {renderedOldNotifications}

      {notificationsReceived.map((notificationReceived, index) => (
        <div key={index}>{notificationReceived}</div>
      ))}
    </div>
  );
};
