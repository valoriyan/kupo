/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { MediaElement } from "#/api";
import { styled } from "#/styling";

export interface ContentProps {
  mediaElement: MediaElement;
}

export const VideoContentViewer = ({ mediaElement }: ContentProps) => {
  const videoRef = useRef(undefined);

  useEffect(() => {
    (videoRef.current as any).autoplay = false;
    (videoRef.current as any).playsinline = true;
  });

  return (
    <Video src={mediaElement.temporaryUrl} autoPlay={false} playsInline controls={true}>
      <source
        ref={videoRef as any}
        src={mediaElement.temporaryUrl}
        type="video/mp4"
      ></source>
    </Video>
  );
};

const Video = styled("video", {
  position: "absolute",
  size: "100%",
  objectFit: "contain",
});
