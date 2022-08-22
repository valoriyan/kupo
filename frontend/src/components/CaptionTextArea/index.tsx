import { styled } from "#/styling";
import { Stack } from "../Layout";
import { Subtext } from "../Typography";

const CAPTION_CHAR_LIMIT = 512;

export interface CaptionTextAreaProps {
  caption: string;
  setCaption: (caption: string) => void;
}

export const CaptionTextArea = ({ caption, setCaption }: CaptionTextAreaProps) => {
  return (
    <Stack css={{ flex: 1 }}>
      <Caption
        placeholder="add caption..."
        value={caption}
        onChange={(e) => setCaption(e.currentTarget.value.slice(0, CAPTION_CHAR_LIMIT))}
        data-cy="captions-input"
      />
      <Subtext css={{ color: "$secondaryText", p: "$2", pb: 0, alignSelf: "flex-end" }}>
        {caption.length} / {CAPTION_CHAR_LIMIT}
      </Subtext>
    </Stack>
  );
};

export const Caption = styled("textarea", {
  width: "100%",
  height: "12vh",
  minHeight: "$10",
  bg: "transparent",
  resize: "vertical",
  border: "none",
  fontSize: "$3",

  "&::placeholder": {
    color: "$secondaryText",
  },
});
