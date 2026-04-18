describe('Work Schedule Page', () => {
  beforeEach(() => {
    const user = { token: 'fake-token', data: { role: 'employee' }, _id: 'user1' };
    window.localStorage.setItem('user', JSON.stringify(user));

    cy.intercept('GET', '/api/schedules/my', {
      statusCode: 200,
      body: { data: [] },
    }).as('getMySchedules');

    cy.intercept('POST', '/api/hours', {
      statusCode: 200,
      body: { data: { _id: 'hour1' } },
    }).as('postHours');

    cy.intercept('POST', '/api/schedules', {
      statusCode: 200,
      body: { data: { _id: 'schedule1', isAccepted: false } },
    }).as('postSchedule');
  });

  it('loads the Work Schedule page and shows the schedule form', () => {
    cy.visit('/work-schedule');
    cy.wait('@getMySchedules');
    cy.get('[data-cy="work-schedule-page"]').should('exist');
    cy.get('[data-cy="work-schedule-week-select"]').should('exist');
    cy.get('[data-cy="work-schedule-submit-btn"]').should('exist');
  });

  it('submits a new work schedule request', () => {
    cy.visit('/work-schedule');
    cy.wait('@getMySchedules');

    cy.get('[data-cy="week-day-btn"]').first().click();
    cy.get('[data-cy="start-time-range"]').invoke('val', 9).trigger('input');
    cy.get('[data-cy="end-time-range"]').invoke('val', 17).trigger('input');
    cy.get('[data-cy="work-schedule-submit-btn"]').click();

    cy.wait('@postHours');
    cy.wait('@postSchedule');
    cy.get('[data-cy="my-schedules"]').should('exist');
  });
});
