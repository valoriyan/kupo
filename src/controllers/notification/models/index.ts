import { NOTIFICATION_EVENTS } from "../../../services/webSocketService/eventsConfig";

export interface BaseUserNotification {
  type: NOTIFICATION_EVENTS;
  countOfUnreadNotifications: number;
}

