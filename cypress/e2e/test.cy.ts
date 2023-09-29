describe('test spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.contains(/this is home page/i).should('exist');
  });
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.contains(/home page/i).should('exist');
  });
});
