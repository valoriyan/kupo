import { useWebsocketState } from "#/components/AppLayout/WebsocketContext";

export const Notifications = () => {
  const { notificationsReceived } = useWebsocketState();

  return (
    <div>
      {notificationsReceived.map((notificationReceived, index) => (
        <div key={index}>{notificationReceived}</div>
      ))}
    </div>
  );
};
