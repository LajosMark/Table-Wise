/* global describe, it, cy */
describe('Contact Page', () => {
  it('loads the Contact page and shows contact information', () => {
    cy.visit('/contact');
    cy.get('[data-cy="contact-page"]').should('exist');
    cy.get('[data-cy="contact-title"]').should('contain.text', 'Let’s talk about the experience');
    cy.get('[data-cy="contact-summary"]').should('contain.text', 'Quick contacts');
    cy.get('[data-cy="contact-pill"]').should('have.length', 2);
  });
});