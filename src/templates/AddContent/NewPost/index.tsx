import { useCreatePost } from "#/api/mutations/posts/createPost";
import { Button } from "#/components/Button";
import { CaptionTextArea } from "#/components/CaptionTextArea";
import { DateTimePicker } from "#/components/DateTimePicker";
import { HashTags } from "#/components/HashTags";
import { Flex, Stack } from "#/components/Layout";
import { MediaUpload } from "#/components/MediaUpload";
import { ScrollArea } from "#/components/ScrollArea";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { AdditionalScreen } from "..";
import { useFormState } from "../FormContext";

export interface NewPostProps {
  setAdditionalScreen: (additionalScreen: AdditionalScreen) => void;
}

export const NewPost = (props: NewPostProps) => {
  const {
    mediaFiles,
    addMedia,
    getMediaActions,
    caption,
    setCaption,
    hashTags,
    setHashTags,
    expirationDate,
    setExpirationDate,
  } = useFormState();
  const { mutateAsync: createPost, isLoading } = useCreatePost();

  const canSubmit = !!caption || !!mediaFiles.length;

  return (
    <ScrollArea>
      <Wrapper>
        <Stack>
          <SectionWrapper>
            <MediaUpload
              mediaFiles={mediaFiles}
              addMedia={addMedia}
              getMediaActions={getMediaActions}
              setAdditionalScreen={props.setAdditionalScreen}
            />
          </SectionWrapper>
          <SectionWrapper>
            <CaptionTextArea caption={caption} setCaption={setCaption} />
          </SectionWrapper>
          <SectionWrapper>
            <HashTags
              hashTags={hashTags}
              setHashTags={setHashTags}
              limit={10}
              placeholder="add hashtags (limit 10)"
            />
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
        <Stack css={{ gap: "$3", px: "$5", pb: "$6" }}>
          <Button
            size="lg"
            variant="secondary"
            disabled={!canSubmit || isLoading}
            onClick={() => createPost()}
          >
            <TextOrSpinner isLoading={isLoading}>Post Now</TextOrSpinner>
          </Button>
        </Stack>
      </Wrapper>
    </ScrollArea>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr) auto",
  rowGap: "$5",
  size: "100%",
});

export const SectionWrapper = styled("div", {
  p: "$5",
  borderBottomStyle: "solid",
  borderBottomColor: "$border",
  borderBottomWidth: "$1",
});
