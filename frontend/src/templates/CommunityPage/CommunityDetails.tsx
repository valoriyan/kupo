import React from "react";
import { RenderablePublishingChannel } from "#/api";
import { Flex, Grid, Stack } from "#/components/Layout";
import { UserName } from "#/components/UserName";
import { styled } from "#/styling";
import { ErrorMessage } from "#/components/ErrorArea";

export interface CommunityDetailsProps {
  community: RenderablePublishingChannel;
}

export const CommunityDetails = ({ community }: CommunityDetailsProps) => {
  const { publishingChannelRules, externalUrls, owner } = community;

  return (
    <Stack>
      <Section heading="Rules">
        {publishingChannelRules.length ? (
          <Grid css={{ gridTemplateColumns: "auto auto", columnGap: "$4", rowGap: "$4" }}>
            {publishingChannelRules.map((rule, i) => (
              <React.Fragment key={rule + i}>
                <span>{i + 1}.</span>
                <span>{rule}</span>
              </React.Fragment>
            ))}
          </Grid>
        ) : null}
      </Section>
      <Section heading="Links">
        {externalUrls.map((url) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        ))}
      </Section>
      <Section heading="Moderators">
        <UserName username={owner.username} />
      </Section>
    </Stack>
  );
};

const Section: React.FC<{ heading: string }> = ({ heading, children }) => {
  return (
    <Stack as="section">
      <SectionHeading>{heading}</SectionHeading>
      {React.Children.count(children) ? (
        <Stack css={{ gap: "$4", my: "$5" }}>
          {React.Children.map(children, (child) => (
            <Flex css={{ px: "$6" }}>{child}</Flex>
          ))}
        </Stack>
      ) : (
        <ErrorMessage>No {heading.toLocaleLowerCase()} yet</ErrorMessage>
      )}
    </Stack>
  );
};

const SectionHeading = styled("div", {
  px: "$6",
  py: "$4",
  backgroundColor: "$background2",
  fontWeight: "$bold",
});
