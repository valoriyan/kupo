import {
  DeleteCommunityPageArgs,
  useDeleteCommunityPage,
} from "#/api/mutations/community/deleteCommunityPage";
import { Button } from "#/components/Button";
import { ModalFooter, openModal, StandardModalWrapper } from "#/components/Modal";
import { TextOrSpinner } from "#/components/TextOrSpinner";
import { Body, MainTitle } from "#/components/Typography";

export const DeleteCommunityButton = (props: DeleteCommunityPageArgs) => {
  return (
    <Button size="lg" variant="danger" onClick={() => openDeleteCommunityModal(props)}>
      Delete Community
    </Button>
  );
};

const openDeleteCommunityModal = (args: DeleteCommunityPageArgs) => {
  openModal({
    id: "Delete Community Modal",
    children: ({ hide }) => <DeleteCommunityModal hide={hide} {...args} />,
  });
};

const DeleteCommunityModal = ({
  hide,
  ...props
}: DeleteCommunityPageArgs & { hide: () => void }) => {
  const { mutateAsync: deleteCommunity, isLoading } = useDeleteCommunityPage(props);

  return (
    <StandardModalWrapper>
      <MainTitle>Are you sure?</MainTitle>
      <Body css={{ color: "$secondaryText" }}>
        Once <strong>+{props.communityName}</strong> is deleted, it cannot be recovered.
      </Body>
      <ModalFooter>
        <Button variant="secondary" onClick={hide}>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={isLoading}
          onClick={async () => {
            await deleteCommunity();
            hide();
          }}
          css={{ whiteSpace: "nowrap" }}
        >
          <TextOrSpinner isLoading={isLoading}>Delete Community</TextOrSpinner>
        </Button>
      </ModalFooter>
    </StandardModalWrapper>
  );
};
