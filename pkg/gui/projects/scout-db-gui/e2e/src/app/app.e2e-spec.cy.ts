/// <reference types="Cypress" />

describe('App', () => {
  beforeEach(() => {
    cy.visit('/'); // Navigate to the home page before each test
  });

  it('should redirect to "examples/form" route', () => {
    cy.url().should('include', '/examples/form'); // Check if URL includes 'about'
  });

  it('should display current year in the footer', () => {
    const currentYear = new Date().getFullYear().toString();
    cy.get('[data-testid="footer-signature-year"]').should(
      'have.text',
      currentYear
    ); // Check if footer contains the current year
  });

  it('should have "Form", "List" menus', () => {
    const expectedMenus = ['Form', 'List'];
    cy.get('[data-testid="app-nav-bar-main"]').within(() => {
      cy.get('[data-testid="app-nav-bar-route-button"]').each((menu, index) => {
        cy.wrap(menu).should('have.text', expectedMenus[index]);
      });
    });
  });
});
