/* global describe, it, beforeEach, cy, Cypress */
describe('Login Page', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/users/login', {
      statusCode: 200,
      body: { token: 'fake-token' },
    }).as('loginRequest');

    cy.intercept('GET', '/api/users/me', {
      statusCode: 200,
      body: { _id: 'user1', email: 'test@example.com', data: { role: 'employee' } },
    }).as('meRequest');
  });

  it('loads the login page and shows the login form', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-page"]').should('exist');
    cy.get('[data-cy="login-email-input"]').should('exist');
    cy.get('[data-cy="login-password-input"]').should('exist');
    cy.get('[data-cy="login-submit-btn"]').should('contain.text', 'Login');
  });

  it('submits the login form and calls the API', () => {
    cy.visit('/login');
    cy.get('[data-cy="login-email-input"]').type('test@example.com');
    cy.get('[data-cy="login-password-input"]').type('password123');
    cy.get('[data-cy="login-submit-btn"]').click();
    cy.wait('@loginRequest');
    cy.wait('@meRequest');
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
