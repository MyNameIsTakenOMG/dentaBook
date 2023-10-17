describe('auth e2e', () => {
  it('should update the UI when the auth state changes', () => {
    cy.visit('/');
    cy.contains(/family dentistry/i).should('exist');
    cy.get('[data-cy="header-login-btn"]').click();
    cy.get('[data-cy="auth-modal-close-btn"]').should('be.visible');
    cy.get('div[data-amplify-authenticator] [data-amplify-container]').should(
      'be.visible'
    );

    // fill the form and login
    cy.get('[type="email"]').type(Cypress.env('cognito_username'));
    cy.get('[type="password"]').type(Cypress.env('cognito_password'));
    cy.get('button[type="submit"]').click();

    //give a few seconds for authentication
    cy.wait(2000);

    //verify if we pass the login modal
    cy.get('div[data-amplify-authenticator] [data-amplify-container]').should(
      'not.exist'
    );
    cy.get('[data-cy="header-tooltip-title"]').should(
      'include.text',
      Cypress.env('cognito_username').slice(0, 6)
    );
    cy.get('[data-cy="home-landing-welcome"]').should(
      'include.text',
      'Welcome'
    );
    cy.get('[data-cy="header-login-btn"]').should('include.text', 'Logout');

    // log out the user
    cy.get('[data-cy="header-login-btn"]').click();
    cy.wait(1000);

    // check if the auth state is reset after logout
    cy.get('[data-cy="header-login-btn"]').should('include.text', 'Login');
    cy.get('[data-cy="home-landing-login-btn"]').should('be.visible');
  });
});
