describe('Admin Work Schedule Page', () => {
  beforeEach(() => {
    const adminUser = { token: 'admin-token', data: { role: 'admin' }, _id: 'admin1' };
    window.localStorage.setItem('user', JSON.stringify(adminUser));

    cy.intercept('GET', '/api/schedules', {
      statusCode: 200,
      body: { data: [] },
    }).as('getSchedules');

    cy.intercept('GET', '/api/hours', {
      statusCode: 200,
      body: { data: [{ _id: 'hour1', startDate: '2026-04-20T09:00:00.000Z', endDate: '2026-04-20T17:00:00.000Z' }] },
    }).as('getHours');

    cy.intercept('POST', '/api/schedules', {
      statusCode: 200,
      body: { data: { _id: 'schedule1', usersId: 'admin1', workHoursId: 'hour1', isAccepted: false } },
    }).as('postSchedule');
  });

  it('loads the Admin Work Schedule page and shows schedule controls', () => {
    cy.visit('/admin/work-schedule');
    cy.wait(['@getSchedules', '@getHours']);
    cy.get('[data-cy="admin-work-schedule-page"]').should('exist');
    cy.get('[data-cy="schedules-list"]').should('exist');
  });

  it('creates a new schedule from the admin form', () => {
    cy.visit('/admin/work-schedule');
    cy.wait(['@getSchedules', '@getHours']);

    cy.get('[data-cy="add-new-schedule-btn"]').click();
    cy.get('[data-cy="new-schedule-form"]').should('be.visible');
    cy.get('[data-cy="schedule-user-input"]').type('user1');
    cy.get('[data-cy="schedule-shift-select"]').select('hour1');
    cy.get('[data-cy="schedule-submit-btn"]').click();

    cy.wait('@postSchedule');
    cy.get('[data-cy="schedules-list"]').should('exist');
  });
});
