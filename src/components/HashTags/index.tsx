import React, { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { styled } from "#/styling";
import { AnimatedHashTag } from "./HashTag";

export * from "./HashTag";

const HASHTAG_REGEX = /^#?.*\s$/g;

export interface HashTagsProps {
  hashTags: string[];
  setHashTags: (hashTags: string[] | ((prev: string[]) => string[])) => void;
  limit?: number;
  placeholder?: string;
  id?: string;
}

export const HashTags = (props: HashTagsProps) => {
  const [text, setText] = useState("");

  const handleBackspace: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Backspace" || text) return;
    props.setHashTags((prev) => {
      const copy = [...prev];
      // Remove last hashtag if user hits backspace with no current text
      copy.pop();
      return copy;
    });
  };

  const onBlur = () => {
    if (props.limit && props.hashTags.length >= props.limit) {
      setText("");
      return;
    }

    const textToMatch = text + " ";

    // Find entered hashtags
    const matchedHashTags = Array.from(textToMatch.matchAll(HASHTAG_REGEX))
      .map((match) => match[0].replaceAll("#", "").replaceAll(" ", ""))
      .filter((x) => x)
      .filter((match) => !props.hashTags.includes(match));
    // Remove entered hashtags
    const strippedText = textToMatch.replaceAll(HASHTAG_REGEX, "");

    setText(matchedHashTags.length ? strippedText : text);
    props.setHashTags((prev) => {
      if (!props.limit) return prev.concat(matchedHashTags);

      const next = prev.concat(matchedHashTags).slice(0, props.limit);
      if (next.length >= props.limit) setText("");
      return next;
    });
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (props.limit && props.hashTags.length >= props.limit) {
      setText("");
      return;
    }

    const newText = e.currentTarget.value.toLocaleLowerCase();
    if (!newText) {
      setText(newText);
      return;
    }

    // Find entered hashtags
    const matchedHashTags = Array.from(newText.matchAll(HASHTAG_REGEX))
      .map((match) => match[0].replaceAll("#", "").replaceAll(" ", ""))
      .filter((x) => x)
      .filter((match) => !props.hashTags.includes(match));
    // Remove entered hashtags
    const strippedText = newText.replaceAll(HASHTAG_REGEX, "");

    setText(strippedText);
    props.setHashTags((prev) => {
      if (!props.limit) return prev.concat(matchedHashTags);

      const next = prev.concat(matchedHashTags).slice(0, props.limit);
      if (next.length >= props.limit) setText("");
      return next;
    });
  };

  return (
    <Wrapper>
      {props.hashTags.map((tag) => (
        <AnimatedHashTag key={tag} tag={tag} />
      ))}
      <Input
        id={props.id}
        placeholder={
          props.hashTags.length ? undefined : props.placeholder ?? "add hashtags..."
        }
        css={{ minWidth: `${text.length}ch` }}
        onBlur={onBlur}
        onKeyDown={handleBackspace}
        onChange={onChange}
        value={text}
        data-cy="hashtags-input"
      />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$3",
  lineHeight: 1.25,
  fontSize: "$3",
  minHeight: "calc($6 + $1)",
  width: "100%",
});

const Input = styled("input", {
  flex: 1,
  minWidth: 0,
  bg: "transparent",
  border: "none",
  fontSize: "$3",

  "&::placeholder": {
    color: "$secondaryText",
  },
});
