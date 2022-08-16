// https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense

import { createTestPost, logInTestUser } from "../../support/utilities";
import { mrTestmanUser, michaelangeloPost } from "../../testData";

describe("First User Actions", () => {
  it("Runs", () => {
    logInTestUser({ userData: mrTestmanUser });

    createTestPost({ postData: michaelangeloPost });
  });
});
