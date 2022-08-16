// https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense

import {
  logInTestUser,
  searchAndMoveToTestUserProfilePage,
  toggleTestUserAccountPrivacy,
} from "../../support/utilities";
import { moveToChat } from "../../support/utilities/chat";
import { mrsTestwomanUser, mrTestmanUser } from "../../testData";

describe("Second User Actions", () => {
  it("Runs", () => {
    logInTestUser({ userData: mrsTestwomanUser });

    toggleTestUserAccountPrivacy();

    searchAndMoveToTestUserProfilePage({ username: mrTestmanUser.username });

    cy.dataCy("unfollow-button").should("not.exist");
    cy.dataCy("follow-button").click();

    cy.dataCy("follow-button").should("not.exist");
    cy.dataCy("unfollow-button").click();
  });

  it("Chats", () => {
    logInTestUser({ userData: mrsTestwomanUser });
    moveToChat();
  });
});
