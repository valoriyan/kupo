import { useEffect } from "react";
import { Stack } from "#/components/Layout";
import { STANDARD_PAGE_HEADER_HEIGHT } from "#/constants";
import { useFormState } from "../FormContext";
import { PreviewImage } from "./PreviewImage";

export * from "./PreviewImage";

export interface MediaPreviewProps {
  initialId?: string;
}

export const MediaPreview = (props: MediaPreviewProps) => {
  const { mediaFiles, getMediaActions } = useFormState();

  useEffect(() => {
    if (!props.initialId) return;
    const initialElement = document.querySelector(`#${srcToId(props.initialId)}`);

    if (initialElement) {
      window.scrollTo({
        top:
          initialElement.getBoundingClientRect().y -
          window.scrollY -
          +STANDARD_PAGE_HEADER_HEIGHT.slice(0, -2),
      });
    }
  }, [props.initialId]);

  return (
    <Stack css={{ gap: "$3" }}>
      {mediaFiles.map((media) => (
        <PreviewImage
          key={media.src}
          id={srcToId(media.src)}
          media={media}
          actions={getMediaActions(media)}
          unBoundHeight
        />
      ))}
    </Stack>
  );
};

const srcToId = (src: string) => src.replaceAll(new RegExp("[:/]", "g"), "");
