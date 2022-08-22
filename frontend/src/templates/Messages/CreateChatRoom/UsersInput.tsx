import {
  ChangeEventHandler,
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
  useState,
} from "react";
import { RenderableUser } from "#/api";
import { Avatar } from "#/components/Avatar";
import { Chip } from "#/components/Chip";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

const USERNAME_REGEX = /^@?.*\s$/g;

export interface UsersInputProps {
  usernames: string[];
  setUsernames: Dispatch<SetStateAction<string[]>>;
  resolvedUsers: RenderableUser[];
  noBg?: boolean;
}

export const UsersInput = (props: UsersInputProps) => {
  const [text, setText] = useState("");

  const handleBackspace: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Backspace" || text) return;
    props.setUsernames((prev) => {
      const copy = [...prev];
      // Remove last username if user hits backspace with no current text
      copy.pop();
      return copy;
    });
  };

  const onBlur = () => {
    const textToMatch = text + " ";

    // Find entered usernames
    const matchedUsernames = Array.from(textToMatch.matchAll(USERNAME_REGEX))
      .map((match) => match[0].replaceAll("@", "").replaceAll(" ", ""))
      .filter((x) => x)
      .filter((match) => !props.usernames.includes(match));
    // Remove entered usernames
    const strippedText = textToMatch.replaceAll(USERNAME_REGEX, "");

    setText(matchedUsernames.length ? strippedText : text);
    props.setUsernames((prev) => prev.concat(matchedUsernames));
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newText = e.currentTarget.value.toLocaleLowerCase();
    if (!newText) {
      setText(newText);
      return;
    }

    // Find entered usernames
    const matchedUsernames = Array.from(newText.matchAll(USERNAME_REGEX))
      .map((match) => match[0].replaceAll("@", "").replaceAll(" ", ""))
      .filter((x) => x)
      .filter((match) => !props.usernames.includes(match));
    // Remove entered usernames
    const strippedText = newText.replaceAll(USERNAME_REGEX, "");

    setText(strippedText);
    props.setUsernames((prev) => prev.concat(matchedUsernames));
  };

  return (
    <Wrapper hasBg={!props.noBg}>
      {props.usernames.map((username) => {
        const user = props.resolvedUsers.find(
          (resolvedUser) => resolvedUser.username === username,
        );

        return user ? (
          <Chip key={user.userId} css={{ gap: "$3", pl: "$1" }}>
            <Avatar
              alt={`${user.username}'s profile picture`}
              src={user.profilePictureTemporaryUrl}
              size="$6"
            />
            {user.username}
          </Chip>
        ) : (
          <Chip key={username} variant="disabled">
            {username}
          </Chip>
        );
      })}
      <Input
        placeholder={props.usernames.length ? undefined : "add users..."}
        css={{ minWidth: `${text.length}ch` }}
        onBlur={onBlur}
        onKeyDown={handleBackspace}
        onChange={onChange}
        value={text}
        data-cy="new-chat-room-users-input"
      />
    </Wrapper>
  );
};

const Wrapper = styled(Flex, {
  flexWrap: "wrap",
  gap: "$3",

  variants: {
    hasBg: {
      true: {
        bg: "$background2",
        p: "$4",
        borderBottom: "solid $borderWidths$1 $border",
        transition: "border-color $1 ease",

        "&:focus-within": {
          outline: "none",
          borderColor: "$primary",
        },
        "> input": { "&:focus": { outline: "none" } },
      },
    },
  },
});

const Input = styled("input", {
  flex: 1,
  minWidth: 0,
  bg: "transparent",
  border: "none",
  fontSize: "$3",
  lineHeight: 1.5,

  "&::placeholder": { color: "$secondaryText" },
});
