import {
  ChangeEvent,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import { FileDescriptor, RenderableUser } from "#/api";
import { useUploadFile } from "#/api/mutations/fileUpload/uploadFile";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { HiddenInput } from "#/components/HiddenInput";
import { PenIcon } from "#/components/Icons";
import { Box, Flex, Grid, Stack } from "#/components/Layout";
import { LimitedTextArea } from "#/components/LimitedTextArea";
import { ListCreator } from "#/components/ListCreator";
import { ScrollArea } from "#/components/ScrollArea";
import { Spinner } from "#/components/Spinner";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";
import { css, styled } from "#/styling";
import { UsersInput } from "#/templates/Messages/CreateChatRoom/UsersInput";
import { useWarnUnsavedChanges } from "#/utils/useWarnUnsavedChanges";

export interface NewCommunityFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  pfpUrl: string | undefined;
  setPfpUrl: (pfpUrl: string) => void;
  setPfpFile: (pfpFile: FileDescriptor) => void;
  backgroundImgUrl: string | undefined;
  setBackgroundImgUrl: (backgroundImgUrl: string) => void;
  setBackgroundImgFile: (backgroundImgFile: FileDescriptor) => void;
  rulesList: string[];
  setRulesList: Dispatch<SetStateAction<string[]>>;
  linksList: string[];
  setLinksList: Dispatch<SetStateAction<string[]>>;
  moderatorNames: string[];
  setModeratorNames: Dispatch<SetStateAction<string[]>>;
  resolvedModerators: RenderableUser[];
  submitLabel: string;
  isSubmitDisabled: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const NewCommunityForm = ({
  name,
  setName,
  description,
  setDescription,
  pfpUrl,
  setPfpUrl,
  setPfpFile,
  backgroundImgUrl,
  setBackgroundImgUrl,
  setBackgroundImgFile,
  rulesList,
  setRulesList,
  linksList,
  setLinksList,
  moderatorNames,
  setModeratorNames,
  resolvedModerators,
  submitLabel,
  isSubmitDisabled,
  onSubmit,
  isSubmitting,
}: NewCommunityFormProps) => {
  const { mutateAsync: uploadFile } = useUploadFile();
  const [isUploadingPfp, setIsUploadingPfp] = useState(false);
  const [isUploadingBackgroundImg, setIsUploadingBackgroundImg] = useState(false);

  const isLoading = isSubmitting || isUploadingPfp || isUploadingBackgroundImg;

  useWarnUnsavedChanges(!isSubmitDisabled || isLoading);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>, type: "pfp" | "bg") => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      const src = URL.createObjectURL(file);
      const mimeType = file.type;
      if (type === "pfp") {
        setPfpUrl(src);
        setIsUploadingPfp(true);
        try {
          const { blobFileKey } = await uploadFile({ file, mimeType });
          setPfpFile({ blobFileKey, mimeType });
          setIsUploadingPfp(false);
        } catch {
          setPfpUrl("");
          setIsUploadingPfp(false);
        }
      } else if (type === "bg") {
        setBackgroundImgUrl(src);
        setIsUploadingBackgroundImg(true);
        try {
          const { blobFileKey } = await uploadFile({ file, mimeType });
          setBackgroundImgFile({ blobFileKey, mimeType });
          setIsUploadingBackgroundImg(false);
        } catch {
          setBackgroundImgUrl("");
          setIsUploadingBackgroundImg(false);
        }
      }
    }
  };

  const fileInput = (type: "pfp" | "bg") => (
    <HiddenInput
      type="file"
      accept="image/png, image/jpeg"
      onChange={(e) => onFileChange(e, type)}
    />
  );

  return (
    <ScrollArea>
      <Wrapper>
        <Stack>
          <Grid
            css={{
              gridTemplateColumns: "auto minmax(0, 1fr)",
              columnGap: "$6",
              p: "$5",
              borderBottom: "solid $borderWidths$1 $border",
            }}
          >
            <Stack css={{ alignItems: "center", gap: "$4" }}>
              <Body>Profile Picture</Body>
              <EditMedia>
                <Box css={{ filter: `brightness(${isUploadingPfp ? 0.4 : 0.8})` }}>
                  <Avatar src={pfpUrl} alt="Current Profile Picture" size="$11" />
                </Box>
                {isUploadingPfp ? <LoadingSpinner size="md" /> : <EditIcon />}
                {fileInput("pfp")}
              </EditMedia>
            </Stack>
            <Stack css={{ alignItems: "center", gap: "$3" }}>
              <Body css={{ alignSelf: "start" }}>Background Image</Body>
              <EditMedia>
                <Box
                  css={{
                    size: "100%",
                    filter: `brightness(${isUploadingBackgroundImg ? 0.4 : 0.8})`,
                  }}
                >
                  <BackgroundImage src={backgroundImgUrl} />
                </Box>
                {isUploadingBackgroundImg ? <LoadingSpinner size="md" /> : <EditIcon />}
                {fileInput("bg")}
              </EditMedia>
            </Stack>
          </Grid>
          <LabeledInputSection label="Name">
            <Input
              placeholder="name your community..."
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </LabeledInputSection>
          <SectionWrapper>
            <LimitedTextArea
              text={description}
              setText={setDescription}
              placeholder="add a description..."
              dataCy="description-input"
            />
          </SectionWrapper>
          <SectionWrapper>
            <MainTitle>Rules</MainTitle>
            <ListCreator
              list={rulesList}
              onChange={setRulesList}
              tooltipText={
                <>
                  You may add up to 5 rules.
                  <br />
                  <br />
                  You may not reject posts until
                  <br />
                  your community has rules.
                </>
              }
              limit={5}
            />
          </SectionWrapper>
          <SectionWrapper>
            <MainTitle>Links</MainTitle>
            <ListCreator
              list={linksList}
              onChange={setLinksList}
              tooltipText="You may add up to 5 links."
              limit={5}
            />
          </SectionWrapper>
          <SectionWrapper>
            <MainTitle>Moderators</MainTitle>
            <UsersInput
              usernames={moderatorNames}
              setUsernames={setModeratorNames}
              resolvedUsers={resolvedModerators}
            />
          </SectionWrapper>
        </Stack>
        <Stack css={{ gap: "$3", px: "$5", pb: "$6" }}>
          <Button
            size="lg"
            variant="secondary"
            disabled={isSubmitDisabled || isLoading}
            onClick={onSubmit}
          >
            <TextOrSpinner isLoading={isSubmitting}>{submitLabel}</TextOrSpinner>
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

const SectionWrapper = styled(Stack, {
  gap: "$4",
  p: "$5",
  borderBottom: "solid $borderWidths$1 $border",
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

const BackgroundImage = (props: { src?: string }) => {
  return props.src ? (
    <BgImg alt="Current Background Image" src={props.src} />
  ) : (
    <BgImgFallback role="img" aria-label="Current Background Image Fallback" />
  );
};

const BgImg = styled("img", {
  size: "100%",
  maxHeight: "$11",
  objectFit: "cover",
});

const BgImgFallback = styled("div", {
  size: "100%",
  maxHeight: "$11",
  bg: "$border",
});

const EditMedia = styled("label", {
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  size: "100%",
  color: "$accentText",
  cursor: "pointer",
});

const centered = css({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const EditIcon = styled(PenIcon, centered);

const LoadingSpinner = styled(Spinner, centered);
