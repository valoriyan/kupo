import { Button } from "#/components/Button";
import { AddR } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { styled } from "#/styling";
import { MediaUpload } from "./MediaUpload";
import { HashTags } from "./HashTags";
import { useFormState } from "../FormContext";
import { AdditionalScreen } from "..";

export interface NewPostProps {
  setAdditionalScreen: (additionalScreen: AdditionalScreen) => void;
}

export const NewPost = (props: NewPostProps) => {
  const { caption, setCaption, mediaFiles } = useFormState();

  const canSubmit = !!caption || !!mediaFiles.length;

  return (
    <Wrapper>
      <Stack css={{ height: "100%", overflow: "auto" }}>
        <SectionWrapper>
          <MediaUpload setAdditionalScreen={props.setAdditionalScreen} />
        </SectionWrapper>
        <SectionWrapper>
          <Caption
            placeholder="add caption..."
            value={caption}
            onChange={(e) => setCaption(e.currentTarget.value)}
          />
        </SectionWrapper>
        <SectionWrapper>
          <HashTags />
        </SectionWrapper>
        <SectionWrapper>
          <LinkItem>
            <AddR />
            Link Shop Item
          </LinkItem>
        </SectionWrapper>
      </Stack>
      <Stack css={{ gap: "$3", px: "$4" }}>
        <Button size="lg" variant="secondary" disabled={!canSubmit}>
          Post Now
        </Button>
        <Button size="lg" variant="secondary" outlined disabled={!canSubmit}>
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
  pb: "$5",
});

const SectionWrapper = styled("div", {
  px: "$4",
  py: "$4",
  borderBottomStyle: "solid",
  borderBottomColor: "$border",
  borderBottomWidth: "$1",
});

const Caption = styled("textarea", {
  width: "100%",
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
