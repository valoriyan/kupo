import React, { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { styled } from "#/styling";
import { HashTag } from "./HashTag";
import { useFormState } from "../../FormContext";

export const HashTags = () => {
  const { hashTags, setHashTags } = useFormState();
  const [text, setText] = useState("");

  const handleBackspace: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key !== "Backspace" || text) return;
    setHashTags((prev) => {
      const copy = [...prev];
      // Remove last hashtag if user hits backspace with no current text
      copy.pop();
      return copy;
    });
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (hashTags.length >= 10) {
      setText("");
      return;
    }

    const newText = e.currentTarget.value;
    if (!newText) {
      setText(newText);
      return;
    }

    // Find entered hashtags
    const matchedHashTags = Array.from(newText.matchAll(/(?<=#).+?(?=\s)/g))
      .map((match) => match[0])
      .filter((match) => !hashTags.includes(match));
    // Remove entered hashtags
    const strippedText = newText.replaceAll(/#.+?\s/g, "");

    setText(strippedText);
    setHashTags((prev) => {
      const next = prev.concat(matchedHashTags).slice(0, 10);
      if (next.length >= 10) setText("");
      return next;
    });
  };

  return (
    <Wrapper>
      {hashTags.map((tag) => (
        <HashTag key={tag} tag={tag} />
      ))}
      <Input
        placeholder={hashTags.length ? undefined : "add hashtags (10 max)"}
        css={{ minWidth: `${text.length}ch` }}
        onKeyDown={handleBackspace}
        onChange={onChange}
        value={text}
      />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "$3",
  lineHeight: 1.25,
  fontSize: "$3",
  minHeight: "calc($5 + $1)",
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
