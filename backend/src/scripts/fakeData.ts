import { Controller } from "tsoa";

class FakeController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setStatus() {}
}

export const fakeController = new FakeController() as unknown as Controller;
