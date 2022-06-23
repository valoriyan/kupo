import { useState } from "react";
import { RootRenderablePost } from "#/api";
import { useSharePost } from "#/api/mutations/posts/sharePost";
import { Button } from "#/components/Button";
import { CaptionTextArea } from "#/components/CaptionTextArea";
import { DateTimePicker } from "#/components/DateTimePicker";
import { HashTags } from "#/components/HashTags";
import { CloseIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { openModal } from "#/components/Modal";
import { ScrollArea } from "#/components/ScrollArea";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { MainTitle } from "#/components/Typography";
import { MAX_APP_CONTENT_WIDTH } from "#/constants";
import { styled } from "#/styling";
import { CloseButton, Header } from "#/templates/AddContent";
import { SectionWrapper } from "#/templates/AddContent/NewPost";
import { SharedPost } from "../SharedPost";

export const openSharePostModal = (props: SharePostModalProps) =>
  openModal({
    id: "Share Post Modal",
    children: ({ hide }) => <SharePostModal hide={hide} {...props} />,
  });

export interface SharePostModalProps {
  post: RootRenderablePost;
}

export const SharePostModal = ({
  post,
  hide,
}: SharePostModalProps & { hide: () => void }) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [expirationDate, setExpirationDate] = useState<Date>();

  const { mutateAsync: sharePost, isLoading } = useSharePost();

  const postNow = async () => {
    await sharePost({
      sharedPostId: post.id,
      caption,
      hashtags,
      expirationTimestamp: expirationDate?.valueOf(),
    });
    hide();
  };

  return (
    <Wrapper>
      <Header>
        <CloseButton onClick={hide}>
          <CloseIcon />
        </CloseButton>
        <MainTitle as="h1">New Post</MainTitle>
      </Header>
      <ScrollArea>
        <FormWrapper>
          <Stack css={{ height: "100%" }}>
            <SectionWrapper css={{ px: 0 }}>
              <Flex css={{ px: "$5" }}>
                <CaptionTextArea caption={caption} setCaption={setCaption} />
              </Flex>
              <SharedPost post={post} contentHeight="30vh" />
            </SectionWrapper>
            <SectionWrapper>
              <HashTags
                hashTags={hashtags}
                setHashTags={setHashtags}
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
              disabled={!caption || isLoading}
              onClick={postNow}
              aria-label="Post Now"
            >
              <TextOrSpinner isLoading={isLoading}>Post Now</TextOrSpinner>
            </Button>
          </Stack>
        </FormWrapper>
      </ScrollArea>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100vh",
  width: "100vw",
  maxWidth: MAX_APP_CONTENT_WIDTH,
  bg: "$pageBackground",
});

const FormWrapper = styled("div", {
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr) auto",
  rowGap: "$5",
  height: "100%",
});
