import { ChangeEvent, PropsWithChildren, useState } from "react";
import { useCreateCommunityPage } from "#/api/mutations/community/createCommunityPage";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { HiddenInput } from "#/components/HiddenInput";
import { PenIcon } from "#/components/Icons";
import { Flex, Grid, Stack } from "#/components/Layout";
import { LimitedTextArea } from "#/components/LimitedTextArea";
import { ScrollArea } from "#/components/ScrollArea";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";
import { styled } from "#/styling";

export const NewCommunityPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [pfpUrl, setPfpUrl] = useState<string>();
  const [pfpFile, setPfpFile] = useState<File>();

  const [backgroundImgUrl, setBackgroundImgUrl] = useState<string>();
  const [backgroundImgFile, setBackgroundImgFile] = useState<File>();

  const { mutateAsync: createCommunityPage, isLoading } = useCreateCommunityPage();
  const canSubmit = !!name;

  const onChange = (e: ChangeEvent<HTMLInputElement>, type: "pfp" | "bg") => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      const src = URL.createObjectURL(file);
      if (type === "pfp") {
        setPfpUrl(src);
        setPfpFile(file);
      } else if (type === "bg") {
        setBackgroundImgUrl(src);
        setBackgroundImgFile(file);
      }
    }
  };

  const input = (type: "pfp" | "bg") => (
    <HiddenInput
      type="file"
      accept="image/png, image/jpeg"
      multiple
      onChange={(e) => onChange(e, type)}
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
                <Darken>
                  <Avatar src={pfpUrl} alt="Current Profile Picture" size="$11" />
                </Darken>
                <EditIcon />
                {input("pfp")}
              </EditMedia>
            </Stack>
            <Stack css={{ alignItems: "center", gap: "$3" }}>
              <Body css={{ alignSelf: "start" }}>Background Image</Body>
              <EditMedia>
                <Darken css={{ size: "100%" }}>
                  <BackgroundImage src={backgroundImgUrl} />
                </Darken>
                <EditIcon />
                {input("bg")}
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
        </Stack>
        <Stack css={{ gap: "$3", px: "$5", pb: "$6" }}>
          <Button
            size="lg"
            variant="secondary"
            disabled={!canSubmit || isLoading}
            onClick={() =>
              createCommunityPage({
                publishingChannelName: name,
                publishingChannelDescription: description,
                profilePicture: pfpFile,
                backgroundImage: backgroundImgFile,
                // TODO
                externalUrl1: undefined,
                externalUrl2: undefined,
                externalUrl3: undefined,
                externalUrl4: undefined,
                externalUrl5: undefined,
                publishingChannelRule1: undefined,
                publishingChannelRule2: undefined,
                publishingChannelRule3: undefined,
                publishingChannelRule4: undefined,
                publishingChannelRule5: undefined,
              })
            }
          >
            <TextOrSpinner isLoading={isLoading}>Create Now</TextOrSpinner>
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

const SectionWrapper = styled("div", {
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

const Darken = styled("div", {
  filter: "brightness(0.9)",
});

const EditIcon = styled(PenIcon, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});
