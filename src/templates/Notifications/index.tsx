import { useGetPageOfOldNotifications } from "#/api/queries/notifications/useGetPageOfOldNotifications";
import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";
import { Avatar } from "#/components/Avatar";

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
      const { userDoingFollowing, type } = notification;

      const timestamp = Date.now();

      const { username, profilePictureTemporaryUrl } = userDoingFollowing;

      return (
        <div key={`${timestamp}+${type}`}>
          <Avatar src={profilePictureTemporaryUrl} alt="User Avatar" size="$7" />

          <span>
            {username} followed you. @ {timestamp}
          </span>
        </div>
      );
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
