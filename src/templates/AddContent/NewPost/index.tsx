import { ReactNode } from "react";
import { Button } from "#/components/Button";
import { AddR } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { styled } from "#/styling";
import { MediaUpload } from "./MediaUpload";

export interface NewPostProps {
  setAdditionalScreen: (screen: ReactNode) => void;
}

export const NewPost = (props: NewPostProps) => {
  return (
    <Wrapper>
      <Stack css={{ height: "100%", overflow: "auto", gap: "$5" }}>
        <MediaUpload setAdditionalScreen={props.setAdditionalScreen} />
        <Caption placeholder="add caption..." />
        <LinkItem>
          <AddR />
          Link Shop Item
        </LinkItem>
      </Stack>
      <Stack css={{ gap: "$3" }}>
        <Button size="lg" variant="secondary">
          Post Now
        </Button>
        <Button size="lg" variant="secondary" outlined>
          Schedule For Later
        </Button>
      </Stack>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr) auto",
  rowGap: "$4",
  height: "100%",
  px: "$4",
  pt: "$4",
  pb: "$5",
});

const Caption = styled("textarea", {
  height: "15vh",
  minHeight: "$10",
  bg: "transparent",
  resize: "vertical",
  border: "none",
  fontSize: "$3",

  "&::placeholder": {
    color: "$secondaryText",
  },
});

const LinkItem = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: "$4",
  fontSize: "$4",
  fontWeight: "$bold",
});
