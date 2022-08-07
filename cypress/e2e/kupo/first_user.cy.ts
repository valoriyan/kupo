// https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense

import { mrTestmanUser, michaelangeloPost } from "../../testData";

describe("First User Actions", () => {
  it("Runs", () => {
    cy.login({ userData: mrTestmanUser });

    cy.createPost({ postData: michaelangeloPost });
  });
});
