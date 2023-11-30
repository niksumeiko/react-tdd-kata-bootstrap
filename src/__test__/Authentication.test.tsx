import { App } from '../App';

describe('Authentication', () => {
    it('should see login page', () => {
        cy.mount(<App />);

        cy.get('a').contains('Login').click();

        // cy.url().should('be', '/login');
        cy.get('form').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });
});
