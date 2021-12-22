import { ChangeEvent } from "react";
import { HiddenInput } from "#/components/HiddenInput";
import { DuplicateIcon } from "#/components/Icons";
import { styled } from "#/styling";
import { PreviewImage, MediaPreview } from "../../MediaPreview";
import { useFormState } from "../../FormContext";
import { AdditionalScreen } from "../..";

export interface MediaUploadProps {
  setAdditionalScreen: (additionalScreen: AdditionalScreen) => void;
}

export const MediaUpload = (props: MediaUploadProps) => {
  const { mediaFiles, addMedia, getMediaActions } = useFormState();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      const src = URL.createObjectURL(file);
      addMedia({ file, src });
    }
  };

  const input = (
    <HiddenInput
      type="file"
      accept="image/png, image/jpeg, video/mp4"
      multiple
      onChange={onChange}
    />
  );

  const onImageClick = (id?: string) => {
    props.setAdditionalScreen({
      node: <MediaPreview initialId={id} />,
      heading: "New Post",
    });
  };

  const additionalImagesCount = mediaFiles.length - 3;

  return (
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
});
