import { styled } from "#/styling";
import { Flex } from "#/components/Layout";
import { Dollar, Folder, Image } from "#/components/Icons";

export const ChatMessageActionRow = ({
  onSubmitNewChatMessage,
}: {
  onSubmitNewChatMessage(event: React.FormEvent): Promise<void>;
}) => {
  

  return <Flex css={{ p: "$3", alignItems: "center", justifyContent: "space-between"}}>
    <Flex css={{gap: "$4"}}>
      <Dollar />
      <Image />
      <Folder />
    </Flex>
    <SendButton onClick={onSubmitNewChatMessage}>
      Send
    </SendButton>
  </Flex>
}



const SendButton = styled("button", {
  backgroundColor: "$primary",
  color: "$inverseText",
  border: "none",
  padding: "$3",
  paddingLeft: "$4",
  paddingRight: "$4",
  float: "right",
  borderRadius: "$4",
});
