/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/cypress/add-commands";

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("dataCy", (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add(
  "login",
  ({
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

    cy.contains("button", "log in", { matchCase: false }).click();

    cy.url().should("include", "/feed");
  },
);

Cypress.Commands.add(
  "createPost",
  ({
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

    postData;
  },
);
