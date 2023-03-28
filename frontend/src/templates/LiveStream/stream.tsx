import { Stream } from "@cloudflare/stream-react";
import { useEffect } from "react";
import { useCreateStream } from "#/api/mutations/live/createStream";

export const StreamLiveStream = () => {
  const videoIdOrSignedUrl = "88eb076721dda781753bf23adc422cf0";

  const { mutateAsync: generateStream } = useCreateStream();

  useEffect(() => {
    generateStream();
  }, [generateStream]);

  return (
    <div>
      <Stream controls src={videoIdOrSignedUrl} />
    </div>
  );
};
