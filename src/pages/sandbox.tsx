import { io, Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAccessToken, ProtectedPage } from "#/contexts/auth";

interface CustomMessageType {
  message: string;
}

interface CustomNewPostNotificationType {
  username: string;
  previewTemporaryUrl: string;
}

const NEW_CHAT_MESSAGE_EVENT_NAME = "NEW_CHAT_MESSAGE";
const NEW_POST_NOTIFICATION_EVENT_NAME = "NEW_POST_NOTIFICATION";

const Sandbox = () => {
  const [messages, setMessages] = useState<{ text: string; imageUrl?: string }[]>([]);

  const [inputMessage, setInputMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      if (!socket) {
        const newSocket = io("ws://localhost:4000", {
          auth: {
            accessToken,
          },
        });
        setSocket(newSocket);

        newSocket.on("connect", () => {
          console.log("CONNECTED!");
        });

        newSocket.on(NEW_CHAT_MESSAGE_EVENT_NAME, ({ message }: CustomMessageType) => {
          console.log("recieved NEW_CHAT_MESSAGE message");
          setMessages([...messages, { text: message }]);
        });

        newSocket.on(
          NEW_POST_NOTIFICATION_EVENT_NAME,
          ({ username, previewTemporaryUrl }: CustomNewPostNotificationType) => {
            console.log("recieved NEW_POST_NOTIFICATION message");
            setMessages([
              ...messages,
              { text: `From ${username}`, imageUrl: previewTemporaryUrl },
            ]);
          },
        );
      }
    });
  }, []);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const message: CustomMessageType = {
      message: inputMessage,
    };

    if (!!socket) {
      socket.emit(NEW_CHAT_MESSAGE_EVENT_NAME, message, (acknowledgement: any) => {
        console.log("acknowledgement", acknowledgement);
      });
    }
  }

  function onChangeInput(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    setInputMessage(event.currentTarget.value || "");
  }

  const lines = messages.map((message, index) => {
    const image = !!message.imageUrl ? (
      <Image src={message.imageUrl} width={"100px"} height={"100px"} />
    ) : null;

    return (
      <div key={index}>
        {image}
        {message.text}
      </div>
    );
  });

  return (
    <div>
      SANDBOX
      <br />
      <form onSubmit={onSubmit}>
        <input value={inputMessage} onChange={onChangeInput}></input>
      </form>
      <br />
      {lines}
    </div>
  );
};

export default ProtectedPage(Sandbox);
