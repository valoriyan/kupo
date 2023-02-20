import { styled } from "#/styling";
import { Stack } from "../Layout";
import { Subtext } from "../Typography";
import { UserAutoComplete } from "../UserAutoComplete";

export interface LimitedTextAreaProps {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  charLimit?: number;
  dataCy?: string;
}

export const LimitedTextArea = ({
  text,
  setText,
  placeholder,
  charLimit = 512,
  dataCy,
}: LimitedTextAreaProps) => {
  return (
    <Stack css={{ flex: 1 }}>
      <UserAutoComplete text={text} setText={setText}>
        <Text
          placeholder={placeholder}
          value={text}
          maxLength={charLimit}
          onChange={(e) => setText(e.currentTarget.value)}
          data-cy={dataCy}
        />
      </UserAutoComplete>
      <Subtext css={{ color: "$secondaryText", p: "$2", pb: 0, alignSelf: "flex-end" }}>
        {text.length} / {charLimit}
      </Subtext>
    </Stack>
  );
};

export const Text = styled("textarea", {
  width: "100%",
  height: "12vh",
  minHeight: "$10",
  bg: "transparent",
  resize: "vertical",
  border: "none",
  fontSize: "$3",

  "&:focus": { outline: "none" },

  "&::placeholder": {
    color: "$secondaryText",
  },
});
