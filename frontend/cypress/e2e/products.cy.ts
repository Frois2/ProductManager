/// <reference types="cypress" />

describe('Fluxo Completo de Produtos (CRUD)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/products', { timeout: 30000 });
  });

  it('Deve criar, editar e excluir um produto com sucesso', () => {
    cy.contains('button', 'New Product').click();
    
    cy.wait(1000);
    cy.get('input[placeholder="Ex: Ergonomic Office Chair"]')
      .should('exist')
      .type('Produto Cypress Teste', { force: true });

    cy.get('input[placeholder="0.00"]')
      .clear({ force: true })
      .type('50.00', { force: true });
    
    cy.contains('button', 'Create Product').click();

    cy.contains('Produto Cypress Teste', { timeout: 10000 }).should('be.visible');
    cy.contains('$50.00').should('be.visible');
    cy.contains('tr', 'Produto Cypress Teste')
      .find('button[title="Edit"]')
      .click();

    cy.wait(1000); 
    cy.get('input[placeholder="Ex: Ergonomic Office Chair"]')
      .clear({ force: true })
      .type('Produto Editado', { force: true });
    cy.get('button[type="submit"]').click();

    cy.contains('Produto Editado').should('be.visible');
    cy.contains('Produto Cypress Teste').should('not.exist');

    cy.contains('tr', 'Produto Editado')
      .find('button[title="Delete"]')
      .click();

    cy.wait(500);
    
    cy.get('button').contains(/Confirm|Delete/).click();
    cy.contains('Produto Editado').should('not.exist');
  });
});