import { Button } from "#/components/Button";
import { AddR } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { MediaUpload } from "./MediaUpload";
import { HashTags } from "./HashTags";
import { useFormState } from "../FormContext";
import { AdditionalScreen } from "..";
import { DateTimePicker } from "#/components/DateTimePicker";
import { useCreatePost } from "#/api/mutations/posts/createPost";

export interface NewPostProps {
  setAdditionalScreen: (additionalScreen: AdditionalScreen) => void;
}

export const NewPost = (props: NewPostProps) => {
  const { caption, setCaption, mediaFiles, expirationDate, setExpirationDate } =
    useFormState();
  const { mutateAsync: createPost } = useCreatePost();

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
        <SectionWrapper>
          <Flex
            css={{ alignItems: "center", justifyContent: "space-between", gap: "$3" }}
          >
            <MainTitle>Duration</MainTitle>
            <DateTimePicker
              placeholder="Forever"
              dateTime={expirationDate}
              setDateTime={setExpirationDate}
            />
          </Flex>
        </SectionWrapper>
      </Stack>
      <Stack css={{ gap: "$3", px: "$4" }}>
        <Button
          size="lg"
          variant="secondary"
          disabled={!canSubmit}
          onClick={() => createPost()}
        >
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
