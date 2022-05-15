import { Controller, Post, Route, Body } from "tsoa";
import {
  UnrenderableCanceledCommentOnPostNotification,
  UnrenderableCanceledNewFollowerNotification,
  UnrenderableCanceledNewLikeOnPostNotification,
} from "../notification/models/unrenderableCanceledUserNotifications";

@Route("utilities")
export class ShareTypesWithFrontendController extends Controller {
  @Post("sendDataTypesToFrontend1")
  public async sendDataTypesToFrontend1(
    @Body()
    requestBody: {
      UnrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPostNotification;
      UnrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification;
      UnrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPostNotification;
    },
  ): Promise<{ response: string }> {
    console.log(requestBody);
    return { response: "response" };
  }
}
