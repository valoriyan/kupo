import { PropsWithChildren, useState } from "react";
import { useCreateCommunityPage } from "#/api/mutations/community/createCommunityPage";
import { Button } from "#/components/Button";
import { Flex, Stack } from "#/components/Layout";
import { LimitedTextArea } from "#/components/LimitedTextArea";
import { ScrollArea } from "#/components/ScrollArea";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { MainTitle } from "#/components/Typography";
import { styled } from "#/styling";

export const NewCommunityPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutateAsync: createCommunityPage, isLoading } = useCreateCommunityPage();
  const canSubmit = !!name;

  return (
    <ScrollArea>
      <Wrapper>
        <Stack>
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
