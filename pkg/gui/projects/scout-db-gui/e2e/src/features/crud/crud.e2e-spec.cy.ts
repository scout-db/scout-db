/// <reference types="Cypress" />

describe('CRUD Page', () => {
  const TEST_TEXT_1 = 'CRUD Test Data 1' + Math.random() * 1000;
  const TEST_TEXT_2 = 'CRUD Test Data 2' + Math.random() * 1000;
  const TEST_TEXT_3 = 'CRUD Test Data 3' + Math.random() * 1000;
  const TEST_TEXT_4 = 'CRUD Test Data 4' + Math.random() * 1000;

  beforeEach(() => {
    cy.visit('/').get('[data-testid="about-page-examples-button"]').click();
    cy.get('[data-testid="examples-component-nav-bar"]').within(() => {
      cy.get('[data-testid="examples-component-mat-tab-link-crud"]').click();
    });
  });

  it('adds new data entry', async () => {
    cy.get('[data-testid="crud-component-book-mat-card"]').should(
      'have.length',
      1
    );
    cy.get('[data-testid="crud-component-add-new-button"]').click();

    cy.get('[data-testid="crud-component-form-field-title"]').type(TEST_TEXT_1);
    cy.get('[data-testid="crud-component-form-field-author"]').type(
      TEST_TEXT_2
    );
    cy.get('[data-testid="crud-component-form-field-description"]').type(
      TEST_TEXT_3
    );

    cy.get('[data-testid="crud-component-form-button-submit"]').click();
    cy.get('[data-testid="crud-component-book-mat-card"]').should(
      'have.length',
      2
    );

    cy.get('[data-testid="crud-component-existing-books-list"]').within(() => {
      cy.get('h3:contains("' + TEST_TEXT_1 + '")').click();
    });

    cy.get('[data-testid="crud-component-form-button-edit"]').click();
    cy.get('[data-testid="crud-component-form-field-author"]').clear();
    cy.get('[data-testid="crud-component-form-field-author"]').type(
      TEST_TEXT_4
    );
    cy.get('[data-testid="crud-component-form-button-submit"]').click();
    cy.get('[data-testid="crud-component-book-mat-card"]').should(
      'have.length',
      2
    );
    cy.get('[data-testid="crud-component-existing-books-list"]').within(() => {
      cy.get('small:contains("' + TEST_TEXT_4 + '")').should('be.visible');
    });
  });
});
