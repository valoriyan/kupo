import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { useCreateShopItem } from "#/api/mutations/shopItems/createShopItem";
import { useGetUsersByUsernames } from "#/api/queries/users/useGetUsersByUsernames";
import { Button } from "#/components/Button";
import { DateTimePicker } from "#/components/DateTimePicker";
import { HashTags } from "#/components/HashTags";
import { EyeIcon, InfoIcon, TagIcon } from "#/components/Icons";
import { Flex, Stack } from "#/components/Layout";
import { LimitedTextArea } from "#/components/LimitedTextArea";
import { MediaUpload } from "#/components/MediaUpload";
import { Popover } from "#/components/Popover";
import { PriceInput } from "#/components/PriceInput";
import { ScrollArea } from "#/components/ScrollArea";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";
import { styled } from "#/styling";
import { UsersInput } from "#/templates/Messages/CreateChatRoom/UsersInput";
import { AdditionalScreen } from "..";
import { useFormState } from "../FormContext";

export interface NewShopItemProps {
  setAdditionalScreen: (additionalScreen: AdditionalScreen) => void;
  publishingChannelId: string | undefined;
}

export const NewShopItem = (props: NewShopItemProps) => {
  const {
    mediaFiles,
    addMedia,
    getMediaActions,
    purchasedMediaFiles,
    addPurchasedMedia,
    getPurchasedMediaActions,
    title,
    setTitle,
    price,
    setPrice,
    caption,
    setCaption,
    hashTags,
    setHashTags,
    collaboratorUsers,
    setCollaboratorUsers,
    expirationDate,
    setExpirationDate,
  } = useFormState();
  const [usernames, setUsernames] = useState<string[]>(
    collaboratorUsers.map((user) => user.username),
  );

  const { data: users } = useGetUsersByUsernames({ usernames });
  const resolvedUsers = useMemo(
    () => (!!users ? users?.flatMap((user) => (user ? [user] : [])) : []),
    [users],
  );

  useEffect(() => {
    setCollaboratorUsers(resolvedUsers);
  }, [setCollaboratorUsers, resolvedUsers]);

  const { mutateAsync: createShopItem, isLoading } = useCreateShopItem(
    props.publishingChannelId,
  );

  const canSubmit =
    !!title && !!mediaFiles.length && !!purchasedMediaFiles.length && !!price;

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
              heading={{ label: "Preview", Icon: EyeIcon }}
            />
          </SectionWrapper>
          <SectionWrapper css={{ bg: "$primaryTranslucent" }}>
            <MediaUpload
              mediaFiles={purchasedMediaFiles}
              addMedia={addPurchasedMedia}
              getMediaActions={getPurchasedMediaActions}
              setAdditionalScreen={props.setAdditionalScreen}
              heading={{ label: "Product", Icon: TagIcon }}
            />
          </SectionWrapper>
          <LabeledInputSection label="Title">
            <Input
              placeholder="add title..."
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </LabeledInputSection>
          <LabeledInputSection label="Price">
            <PriceInput price={price} setPrice={setPrice} />
          </LabeledInputSection>
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
            <Stack css={{ gap: "$4" }}>
              <Flex css={{ gap: "$4", alignItems: "center" }}>
                <MainTitle>Collaborators</MainTitle>
                <Popover trigger={<InfoIcon />}>
                  <Body css={{ p: "$5" }}>
                    Add a collaborator to <br /> split profits evenly
                  </Body>
                </Popover>
              </Flex>
              <UsersInput
                usernames={usernames}
                setUsernames={setUsernames}
                resolvedUsers={resolvedUsers}
                noBg
              />
            </Stack>
          </SectionWrapper>
          <LabeledInputSection label="Duration">
            <DateTimePicker
              placeholder="Forever"
              dateTime={expirationDate}
              setDateTime={setExpirationDate}
            />
          </LabeledInputSection>
        </Stack>
        <Stack css={{ gap: "$3", px: "$5", pb: "$6" }}>
          <Button
            size="lg"
            variant="secondary"
            disabled={!canSubmit || isLoading}
            onClick={() => createShopItem(uuid())}
          >
            <TextOrSpinner isLoading={isLoading}>Post Now</TextOrSpinner>
          </Button>
        </Stack>
      </Wrapper>
    </ScrollArea>
  );
};

const LabeledInputSection = ({
  children,
  label,
}: PropsWithChildren<{ label: string }>) => (
  <SectionWrapper>
    <Flex css={{ alignItems: "center", justifyContent: "space-between", gap: "$3" }}>
      <MainTitle>{label}</MainTitle>
      {children}
    </Flex>
  </SectionWrapper>
);

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

const Input = styled("input", {
  flex: 1,
  bg: "transparent",
  border: "none",
  fontSize: "$3",
  textAlign: "right",

  "&::placeholder": {
    color: "$secondaryText",
  },
});
