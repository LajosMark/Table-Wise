/* global describe, it, cy */
describe('About Page', () => {
  it('loads the About page and shows the hero section', () => {
    cy.visit('/about');
    cy.get('[data-cy="about-page"]').should('exist');
    cy.get('[data-cy="about-title"]').should('contain.text', 'Our Story');
    cy.get('[data-cy="about-features"]').find('[data-cy="about-feature-card"]').should('have.length', 3);
  });
});