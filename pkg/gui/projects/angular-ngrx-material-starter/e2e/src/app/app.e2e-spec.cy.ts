/// <reference types="Cypress" />

describe('App', () => {
  beforeEach(() => {
    cy.visit('/'); // Navigate to the home page before each test
  });

  it('should redirect to "about" route', () => {
    cy.url().should('include', '/about'); // Check if URL includes 'about'
  });

  it('should display current year in the footer', () => {
    const currentYear = new Date().getFullYear().toString();
    cy.get('[data-testid="footer-signature-year"]').should(
      'have.text',
      currentYear
    ); // Check if footer contains the current year
  });

  it('should have "About", "Features", "Examples" menus', () => {
    const expectedMenus = ['About', 'Features', 'Examples'];
    cy.get('[data-testid="app-nav-bar-main"]').within(() => {
      cy.get('[data-testid="app-nav-bar-route-button"]').each((menu, index) => {
        console.log('menu=%o, index=%o', menu, index);
        cy.wrap(menu).should('have.text', expectedMenus[index]);
      });
    });
  });
});
