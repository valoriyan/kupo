/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller } from "tsoa";
import { UnrenderableUser } from "../controllers/user/models";

export async function userRegistrationPortalHook({
  controller,
  networkPortalId,
  unrenderableUser,
}: {
  controller: Controller;
  networkPortalId: string;
  unrenderableUser: UnrenderableUser;
}): Promise<void> {
  return;
}
