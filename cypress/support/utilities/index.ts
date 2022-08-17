/* eslint-disable @typescript-eslint/no-explicit-any */

export const toggleTestUserAccountPrivacy = () => {
  cy.contains("div", "Settings").click();
  cy.contains("a", "Profile").click();

  cy.dataCy("profile-privacy-toggle").click();
};

export const logInTestUser = ({
  userData,
}: {
  userData: {
    username: string;
    email: string;
    password: string;
  };
}) => {
  cy.visit("/");
  cy.contains("log in").click();

  cy.get("input[placeholder=email]").type(userData.email);
  cy.get("input[placeholder=password]").type(userData.password);

  cy.contains("button", "log in", { matchCase: false })
    .click()
    .then(() => {
      cy.url().should("include", "/feed");
    });
};

export const createTestPost = ({
  postData,
}: {
  postData: {
    images: string[];
    caption: string;
    hashtags: string[];
  };
}) => {
  cy.contains("a", "Create").click();
  cy.contains("New Post").click();

  (cy as any).findByLabelText("Media Upload").selectFile(postData.images[0], {
    force: true,
  });

  cy.get(`[data-cy="captions-input"]`).type(postData.caption);
  cy.get(`[data-cy="hashtags-input"]`).type(postData.hashtags.join(" "));

  (cy as any).findByText("Post Now").click();

  cy.url().should("include", "/feed");
};

export const searchAndMoveToTestUserProfilePage = ({
  username,
}: {
  username: string;
}): Cypress.Chainable<string> => {
  cy.dataCy("home-button").click();
  cy.dataCy(`search-button`).click();
  cy.dataCy(`discover-search-input`).type(username);
  cy.contains(`a`, username).click();

  return cy.url().should("include", `/profile/${username}`);
};
