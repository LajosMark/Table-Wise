describe('Menu Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/meal-categories', {
      statusCode: 200,
      body: { data: [{ _id: 'cat1', name: 'Starters' }] },
    }).as('getCategories');

    cy.intercept('GET', '/api/meals', {
      statusCode: 200,
      body: { data: [{ _id: 'meal1', name: 'Salad', description: 'Fresh salad', price: 1200, categoryId: 'cat1', image: null }] },
    }).as('getMeals');
  });

  it('loads the Menu page and shows categories and meals', () => {
    cy.visit('/');
    cy.wait(['@getCategories', '@getMeals']);
    cy.get('[data-cy="menu-page"]').should('exist');
    cy.get('[data-cy="menu-category-btn"]').should('contain.text', 'Starters');
    cy.get('[data-cy="menu-meal-card"]').should('have.length', 1);
    cy.get('[data-cy="menu-meal-title"]').should('contain.text', 'Salad');
  });
});