import { Add, Search } from "#/components/Icons";
import { Flex } from "#/components/Layout";
import { styled } from "#/styling";

const ContentFeedTopic = ({ topicName }: { topicName: string }) => {
  return <div>{topicName}</div>;
};

export const ContentFeedControlBar = () => {
  const topics = ["Following"];

  const renderedTopics = topics.map((topic) => {
    return <ContentFeedTopic topicName={topic} key={topic} />;
  });

  return (
    <FlexWrapper>
      <div>{renderedTopics}</div>
      <FlexIcons css={{ gap: "$4", marginLeft: "auto" }}>
        <Add />
        <Search />
      </FlexIcons>
    </FlexWrapper>
  );
};

const FlexWrapper = styled(Flex, {
  padding: "$4",
  borderBottom: "1px solid $background3",

  justifyContent: "flex-start",
  alignItems: "center",
  width: "100%",
  height: "100%",
});

const FlexIcons = styled(Flex, {
  gap: "$4",
  marginLeft: "auto",
});
