// https://github.com/cypress-io/cypress-example-todomvc#cypress-intellisense

import { addCommentToPost, createTestPost, logInTestUser, logOutTestUser, searchAndMoveToTestUserProfilePage, toggleTestUserAccountPrivacy } from "../../support/utilities";
import { createNewChat, moveToExistingChat, submitChatMessage } from "../../support/utilities/chat";
import { mrTestmanUser, michaelangeloPost, mrsTestwomanUser, daVinciPost } from "../../testData";

describe("Kupo Tests", () => {

  xit("User 1 Creates a Post", () => {
    logInTestUser({ userData: mrTestmanUser });
    createTestPost({ postData: michaelangeloPost });
    logOutTestUser();
  });

  xit("User 2 Becomes Private", () => {
    logInTestUser({ userData: mrsTestwomanUser });
    toggleTestUserAccountPrivacy();
    logOutTestUser();
  });

  xit("User 2 Creates a Post", () => {
    logInTestUser({ userData: mrsTestwomanUser });
    createTestPost({ postData: daVinciPost });
    logOutTestUser();
  });

  xit("User 2 Follows User 1", () => {
    logInTestUser({ userData: mrsTestwomanUser });

    searchAndMoveToTestUserProfilePage({ username: mrTestmanUser.username })
    cy.dataCy("unfollow-button").should("not.exist");
    cy.dataCy("follow-button").click();

    cy.dataCy("follow-button").should("not.exist");
    cy.dataCy("unfollow-button").click();
    
    logOutTestUser();
  });

  xit("User 1 Requests to Follow User 2", () => {
    logInTestUser({ userData: mrTestmanUser });

    searchAndMoveToTestUserProfilePage({ username: mrsTestwomanUser.username });
    
    cy.dataCy("unfollow-button").should("not.exist");
    cy.dataCy("follow-button").click();
    logOutTestUser();

  });

  xit("User 2 Sends a Message to User 1", () => {
    logInTestUser({ userData: mrsTestwomanUser });
    createNewChat({targetChatUsername: mrTestmanUser.username});

    submitChatMessage({message: "hello husband"})
    logOutTestUser();
  });

  xit("User 1 Has 1 Chat Notification and Reads Chat Message", () => {
    logInTestUser({ userData: mrTestmanUser });
    cy.dataCy("count-of-unread-chat-rooms").should("have.text", "1")
    moveToExistingChat({targetChatUsername: mrsTestwomanUser.username});
    cy.dataCy("count-of-unread-chat-rooms").should("have.text", "0")
    logOutTestUser();
  });


  xit("User 1 Sends a Message to User 2", () => {
    logInTestUser({ userData: mrTestmanUser });
    moveToExistingChat({targetChatUsername: mrsTestwomanUser.username});

    submitChatMessage({message: "hello wife"});
  });

  it("User 2 Likes the Post of User 1", () => {
    logInTestUser({ userData: mrsTestwomanUser });
    searchAndMoveToTestUserProfilePage({ username: mrsTestwomanUser.username });
    addCommentToPost({comment: "very nice, I like!"});
  });




});
