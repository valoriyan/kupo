import { ChangeEvent } from "react";
import { HiddenInput } from "#/components/HiddenInput";
import { DuplicateIcon } from "#/components/Icons";
import { styled } from "#/styling";
import { AdditionalScreen } from "#/templates/AddContent";
import { MediaPreview, PreviewImage } from "#/templates/AddContent/MediaPreview";
import { EyeIcon } from "../Icons/generated/EyeIcon";
import { Flex, Stack } from "../Layout";
import { Heading } from "../Typography";
import { MediaDescriptor } from "#/templates/AddContent/FormContext";
import { useUploadFile } from "#/api/mutations/fileUpload/uploadFile";

export interface MediaUploadProps {
  mediaFiles: MediaDescriptor[];
  addMedia: (media: MediaDescriptor) => void;
  updateMedia: (media: Partial<MediaDescriptor> & { src: string }) => void;
  getMediaActions: (media: MediaDescriptor) => {
    moveUp: () => void;
    moveDown: () => void;
    delete: () => void;
  };
  setAdditionalScreen: (additionalScreen: AdditionalScreen) => void;
  heading?: { label: string; Icon: typeof EyeIcon };
}

export const MediaUpload = ({
  mediaFiles,
  addMedia,
  updateMedia,
  getMediaActions,
  setAdditionalScreen,
  heading,
}: MediaUploadProps) => {
  const { mutateAsync: uploadFile } = useUploadFile();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      const src = URL.createObjectURL(file);
      const mimeType = file.type;
      const media = { mimeType, src, blobFileKey: "", isLoading: true };
      addMedia(media);
      uploadFile({ file, mimeType })
        .then(({ blobFileKey }) => {
          updateMedia({ src, blobFileKey, isLoading: false });
        })
        .catch(() => {
          getMediaActions(media).delete();
        });
    }
  };

  const input = (
    <HiddenInput
      aria-label="Media Upload"
      type="file"
      accept="image/png, image/jpeg, image/gif, video/mp4, video/quicktime"
      multiple
      onChange={onChange}
    />
  );

  const onImageClick = (id?: string) => {
    setAdditionalScreen({
      node: <MediaPreview initialId={id} />,
      heading: "New Post",
    });
  };

  const additionalImagesCount = mediaFiles.length - 3;

  const mediaUploadNode = (
    <ImageGrid>
      {mediaFiles.length < 3 ? (
        <>
          {mediaFiles.map((media, i) => (
            <PreviewImage
              key={media.src}
              media={media}
              onClick={() => onImageClick(i === 0 ? undefined : media.src)}
              actions={getMediaActions(media)}
            />
          ))}
          <AddMedia>
            <DuplicateIcon />
            {input}
          </AddMedia>
        </>
      ) : (
        <>
          <PreviewImage
            key={mediaFiles[0].src}
            media={mediaFiles[0]}
            onClick={() => onImageClick()}
            actions={getMediaActions(mediaFiles[0])}
          />
          <PreviewImage
            key={mediaFiles[1].src}
            media={mediaFiles[1]}
            onClick={() => onImageClick(mediaFiles[1].src)}
            actions={getMediaActions(mediaFiles[1])}
          />
          <WithMoreGrid>
            <PreviewImage
              key={mediaFiles[2].src}
              media={mediaFiles[2]}
              onClick={() => onImageClick(mediaFiles[2].src)}
              actions={additionalImagesCount ? undefined : getMediaActions(mediaFiles[1])}
              overlayText={
                additionalImagesCount ? "+" + additionalImagesCount : undefined
              }
            />
            <AddMedia>
              <DuplicateIcon />
              {input}
            </AddMedia>
          </WithMoreGrid>
        </>
      )}
    </ImageGrid>
  );

  return heading ? (
    <Stack css={{ gap: "$4" }}>
      <Flex css={{ gap: "$4", alignItems: "center" }}>
        <Heading css={{ fontWeight: "bold" }}>{heading.label}</Heading>
        <heading.Icon height={20} width={20} />
      </Flex>
      {mediaUploadNode}
    </Stack>
  ) : (
    mediaUploadNode
  );
};

const ImageGrid = styled("div", {
  display: "grid",
  columnGap: "$2",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  height: "150px",
  width: "100%",
});

const WithMoreGrid = styled("div", {
  display: "grid",
  rowGap: "$2",
  gridTemplateRows: "repeat(2, minmax(0, 0.5fr))",
});

const AddMedia = styled("label", {
  position: "relative",
  display: "flex",
  flexShrink: 0,
  justifyContent: "center",
  alignItems: "center",
  size: "100%",
  bg: "$background3",
  color: "$text",

  "&:focus-within": { outline: "solid $borderWidths$1 $primary" },
});
