/// <reference types="cypress" />

describe('Fluxo Completo de Raw Materials ', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/raw-materials', { timeout: 30000 });
  });

  it('Deve criar, visualizar, editar e excluir um material com sucesso', () => {
    cy.contains('button', 'New Material').click();

    cy.get('input[placeholder="Ex: Cotton Fabric, M4 Screw, Wood..."]')
      .should('be.visible')
      .type('Material Cypress', { force: true });

    cy.get('input[placeholder="0"]')
      .clear({ force: true })
      .type('100', { force: true });

    cy.contains('button', /create/i).click({ force: true });

    cy.contains('tr', 'Material Cypress', { timeout: 10000 }).should('be.visible');

    cy.contains('tr', 'Material Cypress')
      .find('button[title="View Details"]')
      .click({ force: true });

    cy.contains('Material Cypress').should('be.visible');
    cy.contains('100.00').should('be.visible');

    cy.contains('button', 'Close').click({ force: true });

    cy.contains('tr', 'Material Cypress')
      .find('button[title="Edit"]')
      .click({ force: true });

    cy.get('input[placeholder="Ex: Cotton Fabric, M4 Screw, Wood..."]')
      .clear({ force: true })
      .type('Material Editado', { force: true });

    cy.contains('button', /save/i).click({ force: true });

    cy.contains('tr', 'Material Editado', { timeout: 10000 }).should('be.visible');
    cy.contains('Material Cypress').should('not.exist');

    cy.contains('tr', 'Material Editado')
      .find('button[title="Delete"]')
      .click({ force: true });

    cy.contains('button', /confirm|delete/i).click({ force: true });

    cy.contains('Material Editado', { timeout: 10000 }).should('not.exist');
  });
});
