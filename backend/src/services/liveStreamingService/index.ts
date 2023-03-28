// https://developers.cloudflare.com/stream/stream-live/webhooks/
// https://developers.cloudflare.com/api/operations/stream-live-inputs-create-a-live-input

import axios from "axios";
import { getEnvironmentVariable } from "src/utilities";

export class LiveStreamingService {
  private static CLOUDFLARE_BASE_URL = `https://api.cloudflare.com/client/v4`;
  private static CLOUDFLARE_ACCOUNT_ID: string = getEnvironmentVariable(
    "CLOUDFLARE_LIVE_ACCOUNT_ID",
  );
  private static CLOUDFLARE_LIVE_API_TOKEN: string = getEnvironmentVariable(
    "CLOUDFLARE_LIVE_API_TOKEN",
  );

  async createLiveInput() {
    const requestUrl = `${LiveStreamingService.CLOUDFLARE_BASE_URL}/accounts/${LiveStreamingService.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`;

    const response = await axios({
      method: "post",
      url: requestUrl,
      data: {
        defaultCreator: "0",
        meta: {
          name: "test stream 1",
        },
        recording: {
          mode: "off",
          requireSignedURLs: false,
          timeoutSeconds: 0,
        },
      },
      headers: {
        Authorization: `Bearer ${LiveStreamingService.CLOUDFLARE_LIVE_API_TOKEN}`,
      },
    });

    console.log("response");
    console.log(response);
  }
}
