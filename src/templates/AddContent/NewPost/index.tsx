import { Button } from "#/components/Button";
import { Add, Duplicate } from "#/components/Icons";
import { Stack } from "#/components/Layout";
import { styled } from "#/styling";

export const NewPost = () => {
  return (
    <Wrapper>
      <Stack css={{ height: "100%", overflow: "auto", gap: "$5" }}>
        <AddMedia>
          <Duplicate />
        </AddMedia>
        <Caption placeholder="add caption..." />
        <LinkItem>
          <Add />
          Link Shop Item
        </LinkItem>
      </Stack>
      <Stack css={{ gap: "$3" }}>
        <Button size="lg" variant="secondary">
          Post Now
        </Button>
        <Button size="lg" variant="secondary" outlined>
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
  px: "$4",
  pt: "$4",
  pb: "$5",
});

const AddMedia = styled("button", {
  display: "flex",
  flexShrink: 0,
  justifyContent: "center",
  alignItems: "center",
  height: "150px",
  width: "100px",
  bg: "$background3",
  color: "$text",
});

const Caption = styled("textarea", {
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
