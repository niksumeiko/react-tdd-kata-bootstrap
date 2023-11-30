import { App } from '../App';

describe('Authentication', () => {
    it.skip('should see login page', () => {
        cy.mount(<App />);
        cy.get('a').contains('Login').click();

        // cy.url().should('be', '/login');
        cy.get('form').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });

    it('see my name after login', () => {
        cy.mount(<App />);

        cy.get('a').contains('Login').click();
        cy.get('input[name="email"]').type('my.email@gmail.com');
        cy.get('input[name="password"]').type('Password.1');
        cy.get('button[type="submit"]').click();

        cy.get('p').contains('My Name').should('be.visible');
    });
});
