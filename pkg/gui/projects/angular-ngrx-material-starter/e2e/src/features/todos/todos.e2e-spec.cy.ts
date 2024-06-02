/// <reference types="Cypress" />

describe('Todo Page', () => {
  const TEST_TODO_TEXT = 'Running e2e tests! ' + Math.random() * 1000;
  beforeEach(() => {
    cy.visit('/examples/todos');
  });

  it('adds and removes todo items', () => {
    cy.get('[data-testid="examples-todo-input"]').within(() => {
      cy.get('input').type(TEST_TODO_TEXT);
    });

    cy.get('[data-testid="examples-todo-button-add"]').click();

    cy.get('[data-testid="examples-todo-list-card"]').should('have.length', 4);
    cy.get('[data-testid="examples-todo-list-card"]')
      .first()
      .should('contain.text', TEST_TODO_TEXT);

    cy.get('[data-testid="examples-todo-button-remove"]').click();

    cy.get('[data-testid="examples-todo-list-card"]').should('have.length', 3);
  });
});
