export const moveToChat = () => {
  cy.dataCy("chat-button").click();

  // cy.dataCy("chat-room-search-input").type("");
  cy.dataCy("new-chat-room-button").click();
  cy.dataCy("new-chat-room-users-input").type("testman");
  // cy.dataCy("chat-room-message-input").type("Hey love!");
  // cy.dataCy("submit-chat-message-button").click();

  // cy.dataCy("chat-room-message-input").type("How are you?");
  // cy.dataCy("submit-chat-message-button").click();
};
