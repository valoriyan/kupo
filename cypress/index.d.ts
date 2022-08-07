/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="cypress" />

// import { FakePostData } from "./testData";

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy(value: string): Cypress.Chainable<JQuery<HTMLElement>>;

    login({
      userData,
    }: {
      userData: {
        username: string;
        email: string;
        password: string;
      };
    }): Chainable<null>;

    createPost({
      postData,
    }: {
      postData: {
        images: string[];
        caption: string;
        hashtags: string[];
      };
    }): Chainable<null>;
  }
}
