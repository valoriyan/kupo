// https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense

import { mrsTestwomanUser, mrTestmanUser } from "../../testData";

describe("Second User Actions", () => {
  it("Runs", () => {
    cy.login({ userData: mrsTestwomanUser });

    cy.get(`[data-cy="search-button"]`).click();
    cy.get(`[data-cy="discover-search-input"]`).type(mrTestmanUser.username);
    cy.contains(`a`, mrTestmanUser.username).click();

    cy.url().should("include", `/profile/${mrTestmanUser.username}`);

    // cy.get('[data-cy="unfollow-button"]').should("not.exist");
    // cy.get('[data-cy="follow-button"]').click();

    // cy.get('[data-cy="follow-button"]').should("not.exist");
    // cy.get(`[data-cy="unfollow-button"]]`).should("exist");
  });
});
