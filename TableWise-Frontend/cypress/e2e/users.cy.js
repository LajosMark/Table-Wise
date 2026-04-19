/* global describe, it, beforeEach, cy */
describe('Users Page', () => {
  beforeEach(() => {
    const adminUser = { token: 'admin-token', data: { role: 'admin' }, _id: 'admin1' };
    window.localStorage.setItem('user', JSON.stringify(adminUser));

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: { data: [{ _id: 'user1', name: 'Test User', email: 'test@example.com', role: 'employee' }] },
    }).as('getUsers');
  });

  it('loads the Users page and shows a list of users', () => {
    cy.visit('/users');
    cy.wait('@getUsers');
    cy.get('[data-cy="users-page"]').should('exist');
    cy.get('[data-cy="users-add-btn"]').should('exist');
    cy.get('[data-cy="user-card"]').should('have.length', 1);
    cy.get('[data-cy="user-name"]').should('contain.text', 'Test User');
  });
});