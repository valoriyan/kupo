import { styled } from "#/styling";
import { Flex } from "#/components/Layout";
import { DollarIcon, FolderIcon, ImageIcon } from "#/components/Icons";

export const ChatMessageActionRow = ({
  onSubmitNewChatMessage,
}: {
  onSubmitNewChatMessage(event: React.FormEvent): Promise<void>;
}) => {
  return (
    <Flex css={{ p: "$3", alignItems: "center", justifyContent: "space-between" }}>
      <Flex css={{ gap: "$5" }}>
        <DollarIcon />
        <ImageIcon />
        <FolderIcon />
      </Flex>
      <SendButton onClick={onSubmitNewChatMessage}>Send</SendButton>
    </Flex>
  );
};

const SendButton = styled("button", {
  backgroundColor: "$primary",
  color: "$inverseText",
  border: "none",
  padding: "$3",
  paddingLeft: "$5",
  paddingRight: "$5",
  float: "right",
  borderRadius: "$4",
});
