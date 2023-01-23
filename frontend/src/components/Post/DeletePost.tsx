import { useDeletePost } from "#/api/mutations/posts/deletePost";
import { Button } from "../Button";
import { ModalFooter, openModal, StandardModalWrapper } from "../Modal";
import { TextOrSpinner } from "../TextOrSpinner";
import { Body, MainTitle } from "../Typography";

export const openDeletePostModal = (args: Omit<DeletePostModalProps, "hide">) => {
  openModal({
    id: "Delete Post Modal",
    children: ({ hide }) => <DeletePostModal hide={hide} {...args} />,
  });
};

export interface DeletePostModalProps {
  publishedItemId: string;
  authorUserId: string;
  hide: () => void;
}

export const DeletePostModal = ({
  publishedItemId,
  authorUserId,
  hide,
}: DeletePostModalProps) => {
  const { mutateAsync: deletePost, isLoading } = useDeletePost({
    publishedItemId,
    authorUserId,
  });

  return (
    <StandardModalWrapper>
      <MainTitle>Are You Sure?</MainTitle>
      <Body css={{ color: "$secondaryText" }}>
        Once this post is deleted, it cannot be recovered.
      </Body>
      <ModalFooter>
        <Button variant="secondary" onClick={hide}>
          Cancel
        </Button>
        <Button
          variant="danger"
          css={{ whiteSpace: "nowrap" }}
          onClick={async () => {
            await deletePost();
            hide();
          }}
          data-cy="deletePost-modal-button"
        >
          <TextOrSpinner isLoading={isLoading}>Delete Post</TextOrSpinner>
        </Button>
      </ModalFooter>
    </StandardModalWrapper>
  );
};
