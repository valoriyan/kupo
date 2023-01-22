import { SetStateAction } from "react";
import { useId } from "@radix-ui/react-id";
import { HashTags } from "#/components/HashTags";
import { Stack } from "#/components/Layout";
import { Body, MainTitle } from "#/components/Typography";
import { styled } from "#/styling";

export interface DiscoverSettingsProps {
  hashtags: string[];
  setHashtags: (newValue: SetStateAction<string[]>) => void;
}

export const DiscoverSettings = (props: DiscoverSettingsProps) => {
  const hashTagsId = useId();

  return (
    <Stack css={{ gap: "$6", p: "$6" }}>
      <MainTitle as="h2">Discover</MainTitle>
      <Stack css={{ gap: "$4" }}>
        <Label as="label" htmlFor={hashTagsId}>
          Profile Hashtags (Limit 5)
        </Label>
        <HashTagsWrapper>
          <HashTags
            id={hashTagsId}
            hashTags={props.hashtags}
            setHashTags={props.setHashtags}
            limit={5}
          />
        </HashTagsWrapper>
      </Stack>
    </Stack>
  );
};

const Label = styled(Body, { color: "$secondaryText" });

const HashTagsWrapper = styled("div", {
  borderRadius: "$4",
  border: "solid $borderWidths$1 $border",
  p: "$3",
});
