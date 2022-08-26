export const createNewChat = ({
  targetChatUsername,
}: {
  targetChatUsername: string;
}) => {
  cy.dataCy("chat-button").click();

  cy.dataCy("new-chat-room-button").click();
  cy.dataCy("new-chat-room-users-input").type(targetChatUsername);
};


export const moveToExistingChat = ({
  targetChatUsername,
}: {
  targetChatUsername: string;
}) => {
  cy.dataCy("chat-button").click();

  cy.dataCy("chat-room-search-input").type(targetChatUsername);

  cy.findByText(`@${targetChatUsername}`).click();

}

export const submitChatMessage = ({
  message
}: {
  message: string;
}) => {
    cy.dataCy("chat-room-message-input").type(message);
    cy.dataCy("submit-chat-message-button").click();

}
