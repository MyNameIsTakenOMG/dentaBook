describe('test spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.contains(/family dentistry/i).should('exist');
  });
});
