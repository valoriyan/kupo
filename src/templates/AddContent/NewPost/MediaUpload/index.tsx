import { ChangeEvent, ReactNode } from "react";
import { HiddenInput } from "#/components/HiddenInput";
import { Duplicate } from "#/components/Icons";
import { styled } from "#/styling";
import { PreviewImage, MediaPreview } from "../../MediaPreview";
import { useFormState } from "../../FormContext";

export interface MediaUploadProps {
  setAdditionalScreen: (screen: ReactNode) => void;
}

export const MediaUpload = (props: MediaUploadProps) => {
  const { mediaPreviews, addMedia, getMediaActions } = useFormState();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget;
    if (!files?.length) return;

    for (const file of files) {
      const src = URL.createObjectURL(file);
      addMedia({ type: file.type, src });
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
    props.setAdditionalScreen(<MediaPreview initialId={id} />);
  };

  const additionalImagesCount = mediaPreviews.length - 3;

  return (
    <ImageGrid>
      {mediaPreviews.length < 3 ? (
        <>
          {mediaPreviews.map((preview, i) => (
            <PreviewImage
              key={preview.src}
              media={preview}
              onClick={() => onImageClick(i === 0 ? undefined : preview.src)}
              actions={getMediaActions(preview)}
            />
          ))}
          <AddMedia>
            <Duplicate />
            {input}
          </AddMedia>
        </>
      ) : (
        <>
          <PreviewImage
            key={mediaPreviews[0].src}
            media={mediaPreviews[0]}
            onClick={() => onImageClick()}
            actions={getMediaActions(mediaPreviews[0])}
          />
          <PreviewImage
            key={mediaPreviews[1].src}
            media={mediaPreviews[1]}
            onClick={() => onImageClick(mediaPreviews[1].src)}
            actions={getMediaActions(mediaPreviews[1])}
          />
          <WithMoreGrid>
            <PreviewImage
              key={mediaPreviews[2].src}
              media={mediaPreviews[2]}
              onClick={() => onImageClick(mediaPreviews[2].src)}
              actions={
                additionalImagesCount ? undefined : getMediaActions(mediaPreviews[1])
              }
              overlayText={
                additionalImagesCount ? "+" + additionalImagesCount : undefined
              }
            />
            <AddMedia>
              <Duplicate />
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
