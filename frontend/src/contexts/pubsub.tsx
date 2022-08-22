import { useEffect } from "react";
import { isServer } from "#/utils/isServer";
import { OpenModalProps } from "#/components/Modal";

export interface PubSubTopics {
  openModal: OpenModalProps;
}

export const createPubSub = <TTopic extends keyof PubSubTopics>(topic: TTopic) => {
  const emit = (payload: PubSubTopics[TTopic]) => {
    if (isServer()) return;
    window.dispatchEvent(
      new CustomEvent<PubSubTopics[TTopic]>(topic, { detail: payload }),
    );
  };

  const useListener = (callback: (payload: PubSubTopics[TTopic]) => void) => {
    useEffect(() => {
      const eventCallback = (e: Event) => {
        const event = e as CustomEvent<PubSubTopics[TTopic]>;
        callback(event.detail);
      };
      window.addEventListener(topic, eventCallback, false);

      return () => {
        window.removeEventListener(topic, eventCallback);
      };
    }, [callback]);
  };

  return [emit, useListener] as const;
};
