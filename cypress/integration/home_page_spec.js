describe("The Home Page", () => {
  it("successfully loads", () => {
    const password = "$ecretPa$$word";
    const username = "hadrian";

    // cy.visit("/");

    // cy.contains("log in").click();

    // cy.contains("Sign Up").click();

    // cy.get("input[name=username]").type(username);
    // cy.get("input[name=email]").type("hadrian@gmail.com");
    // cy.get("input[name=password]").type(password);
    // cy.get("input[name=confirm_password]").type(password);

    cy.visit("/");
    cy.contains("log in").click();
    cy.get("input[name=username]").type(username);
    cy.get("input[name=password]").type(password);
    cy.get("form").submit();

    cy.contains("a", "Create").click();
    cy.contains("New Post").click();

    cy.fixture("testPicture.png").then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: "testPicture.png",
        mimeType: "image/png",
      });
    });

    // cy.find("Create");

    // cy.contains("Complete Sign Up").click();

    // cy.contains("View Your Feed").click();
  });
});
