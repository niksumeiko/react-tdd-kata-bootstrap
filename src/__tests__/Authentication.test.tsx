import { App } from '../App';

describe('Authentication', () => {
    describe('Access login page', () => {
        it('see login page', () => {
            cy.mount(<App />);

            cy.get('button').contains('Login').click();

            cy.url().should('be.a', '/login');
            cy.get('input[name="email"]').should('be.visible');
            cy.get('input[name="password"]').should('be.visible');
            cy.get('input[type="submit"]').should('be.visible');
        });
    });
});
