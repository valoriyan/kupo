import { Stream } from "@cloudflare/stream-react";

export const WatchLiveStream = () => {
  const videoIdOrSignedUrl = "88eb076721dda781753bf23adc422cf0";

  return (
    <div>
      <Stream controls src={videoIdOrSignedUrl} />
    </div>
  );
};
