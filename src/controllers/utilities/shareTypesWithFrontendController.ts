import { Controller, Post, Route, Body } from "tsoa";
import {
  UnrenderableCanceledCommentOnPublishedItemNotification,
  UnrenderableCanceledNewFollowerNotification,
  UnrenderableCanceledNewLikeOnPublishedItemNotification,
} from "../notification/models/unrenderableCanceledUserNotifications";

@Route("utilities")
export class ShareTypesWithFrontendController extends Controller {
  @Post("sendDataTypesToFrontend1")
  public async sendDataTypesToFrontend1(
    @Body()
    requestBody: {
      UnrenderableCanceledCommentOnPostNotification: UnrenderableCanceledCommentOnPublishedItemNotification;
      UnrenderableCanceledNewFollowerNotification: UnrenderableCanceledNewFollowerNotification;
      UnrenderableCanceledNewLikeOnPostNotification: UnrenderableCanceledNewLikeOnPublishedItemNotification;
    },
  ): Promise<{ response: string }> {
    requestBody;
    return { response: "response" };
  }
}
