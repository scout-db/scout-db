/// <reference types="Cypress" />

describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/about'); // Navigate to the About page
  });

  it('should display main heading', () => {
    cy.contains('h1', 'ScoutDB'); // Check the main heading text
  });

  it('first action button should lead to "Form" route', () => {
    cy.get('button:contains("Form")').click();
    cy.url().should('include', '/examples/form'); // Check the URL to ensure it navigated to the "Features" route
  });
});
