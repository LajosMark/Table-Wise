describe('Meal Management Page', () => {
  beforeEach(() => {
    const adminUser = { token: 'admin-token', data: { role: 'admin' }, _id: 'admin1' };
    window.localStorage.setItem('user', JSON.stringify(adminUser));

    cy.intercept('GET', '/api/meal-categories', {
      statusCode: 200,
      body: { data: [{ _id: 'cat1', name: 'Salads' }] },
    }).as('getCategories');

    cy.intercept('GET', '/api/meals', {
      statusCode: 200,
      body: { data: [{ _id: 'meal1', name: 'Caesar Salad', price: 1500, categoryId: 'cat1' }] },
    }).as('getMeals');

    cy.intercept('GET', '/api/ingredients', {
      statusCode: 200,
      body: { data: [] },
    }).as('getIngredients');

    cy.intercept('GET', '/api/fridge-items', {
      statusCode: 200,
      body: [],
    }).as('getFridgeItems');
  });

  it('loads the Meal Management page and shows admin controls', () => {
    cy.visit('/admin/meals');
    cy.wait(['@getCategories', '@getMeals', '@getIngredients', '@getFridgeItems']);
    cy.get('[data-cy="meal-management-page"]').should('exist');
    cy.get('[data-cy="meal-management-tab-meals"]').should('exist');
    cy.get('[data-cy="meal-form"]').should('exist');
    cy.get('[data-cy="meal-name-input"]').should('exist');
  });
});