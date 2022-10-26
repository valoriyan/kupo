import { ChangeEvent, PropsWithChildren } from "react";
import { Avatar } from "#/components/Avatar";
import { Button } from "#/components/Button";
import { HiddenInput } from "#/components/HiddenInput";
import { PenIcon } from "#/components/Icons";
import { Flex, Grid, Stack } from "#/components/Layout";
import { LimitedTextArea } from "#/components/LimitedTextArea";
import { ListCreator } from "#/components/ListCreator";
import { ScrollArea } from "#/components/ScrollArea";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";
import { styled } from "#/styling";

export interface NewCommunityFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  pfpUrl: string | undefined;
  setPfpUrl: (pfpUrl: string) => void;
  setPfpFile: (pfpFile: File) => void;
  backgroundImgUrl: string | undefined;
  setBackgroundImgUrl: (backgroundImgUrl: string) => void;
  setBackgroundImgFile: (backgroundImgFile: File) => void;
  rulesList: string[];
  setRulesList: (rulesList: string[]) => void;
  linksList: string[];
  setLinksList: (linksList: string[]) => void;
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
  submitLabel,
  isSubmitDisabled,
  onSubmit,
  isSubmitting,
}: NewCommunityFormProps) => {
  const onFileChange = (e: ChangeEvent<HTMLInputElement>, type: "pfp" | "bg") => {
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

  const fileInput = (type: "pfp" | "bg") => (
    <HiddenInput
      type="file"
      accept="image/png, image/jpeg"
      multiple
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
                <Darken>
                  <Avatar src={pfpUrl} alt="Current Profile Picture" size="$11" />
                </Darken>
                <EditIcon />
                {fileInput("pfp")}
              </EditMedia>
            </Stack>
            <Stack css={{ alignItems: "center", gap: "$3" }}>
              <Body css={{ alignSelf: "start" }}>Background Image</Body>
              <EditMedia>
                <Darken css={{ size: "100%" }}>
                  <BackgroundImage src={backgroundImgUrl} />
                </Darken>
                <EditIcon />
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
              tooltipText="You may add up to 5 rules"
              limit={5}
            />
          </SectionWrapper>
          <SectionWrapper>
            <MainTitle>Links</MainTitle>
            <ListCreator
              list={linksList}
              onChange={setLinksList}
              tooltipText="You may add up to 5 links"
              limit={5}
            />
          </SectionWrapper>
        </Stack>
        <Stack css={{ gap: "$3", px: "$5", pb: "$6" }}>
          <Button
            size="lg"
            variant="secondary"
            disabled={isSubmitDisabled || isSubmitting}
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

const Darken = styled("div", {
  filter: "brightness(0.9)",
});

const EditIcon = styled(PenIcon, {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});
