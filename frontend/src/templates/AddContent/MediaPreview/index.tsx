import React, { useEffect, useRef } from "react";
import { Stack } from "#/components/Layout";
import { PreviewImage } from "./PreviewImage";
import { Button } from "#/components/Button";
import { DuplicateIcon } from "#/components/Icons";
import { useFormState } from "../FormContext";

export * from "./PreviewImage";

export interface MediaPreviewProps {
  initialId?: string;
}

export const MediaPreview = (props: MediaPreviewProps) => {
  const { mediaFiles, getMediaActions } = useFormState();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!props.initialId) return;
    const initialElement = document.querySelector(`#${srcToId(props.initialId)}`);
    if (ref.current && initialElement) {
      ref.current.scrollTop =
        initialElement.getBoundingClientRect().y - ref.current.getBoundingClientRect().y;
    }
  }, [props.initialId]);

  return (
    <Stack ref={ref} css={{ gap: "$3", height: "100%", overflow: "auto" }}>
      <Button size="lg" variant="secondary" css={{ gap: "$3", m: "$5" }}>
        <DuplicateIcon /> Add Media
      </Button>
      {mediaFiles.map((media) => (
        <PreviewImage
          key={media.src}
          id={srcToId(media.src)}
          media={media}
          actions={getMediaActions(media)}
        />
      ))}
    </Stack>
  );
};

const srcToId = (src: string) => src.replaceAll(new RegExp("[:/]", "g"), "");