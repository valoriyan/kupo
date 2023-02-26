import { useCreatePost } from "#/api/mutations/posts/createPost";
import { Button } from "#/components/Button";
import { DateTimePicker } from "#/components/DateTimePicker";
import { HashTags } from "#/components/HashTags";
import { Flex, Stack } from "#/components/Layout";
import { LimitedTextArea } from "#/components/LimitedTextArea";
import { MediaUpload } from "#/components/MediaUpload";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";
import { AdditionalScreen } from "..";
import { useFormState } from "../FormContext";

export interface NewPostProps {
  setAdditionalScreen: (additionalScreen: AdditionalScreen) => void;
  publishingChannelId: string | undefined;
}

export const NewPost = (props: NewPostProps) => {
  const {
    mediaFiles,
    addMedia,
    updateMedia,
    getMediaActions,
    caption,
    setCaption,
    hashTags,
    setHashTags,
    expirationDate,
    setExpirationDate,
  } = useFormState();
  const { mutateAsync: createPost, isLoading } = useCreatePost(props.publishingChannelId);

  const canSubmit =
    !!caption || (!!mediaFiles.length && mediaFiles.every((file) => !file.isLoading));

  const clearWarning = useWarnUnsavedChanges(canSubmit);

  return (
    <>
      <Stack>
        <SectionWrapper>
          <MediaUpload
            mediaFiles={mediaFiles}
            addMedia={addMedia}
            updateMedia={updateMedia}
            getMediaActions={getMediaActions}
            setAdditionalScreen={props.setAdditionalScreen}
          />
        </SectionWrapper>
        <SectionWrapper>
          <LimitedTextArea
            text={caption}
            setText={setCaption}
            placeholder="add caption..."
            dataCy="caption-input"
          />
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
      <Stack css={{ gap: "$4", px: "$5", py: "$6" }}>
        <Button
          size="lg"
          variant="secondary"
          disabled={!canSubmit || isLoading}
          onClick={() => {
            clearWarning();
            createPost();
          }}
          data-cy="create-content-item-button"
        >
          <TextOrSpinner isLoading={isLoading}>Post Now</TextOrSpinner>
        </Button>
      </Stack>
    </>
  );
};

export const SectionWrapper = styled("div", {
  p: "$5",
  borderBottomStyle: "solid",
  borderBottomColor: "$border",
  borderBottomWidth: "$1",
});
