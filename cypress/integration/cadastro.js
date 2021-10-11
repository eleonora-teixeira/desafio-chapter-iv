/// <reference types="cypress" />

var Chance = require('chance');
var chance = new Chance();

let user = {email : chance.email(), name : { first : chance.first(), last : chance.last()}}

describe('Cadastro', () => {

    it('Quando informo um email já em uso, então deve ser apresentado uma mensagem de erro', () => {
        cy.visit('http://automationpractice.com/index.php')

        //acessa tela de login /cadastro
        cy.get('a.login').click()

        //preenchimento de email já cadastrado e clique no botão de registrar
        cy.get('input#email_create').type('kosew@sog.hr')
        cy.get('button#SubmitCreate').click()

        //assertion de alert de erro
        cy.get('div#create_account_error').should('have.text', 'An account using this email address has already been registered. Please enter a valid password or request a new one. ')
    }),
    it('Quando informo um email inválido, então devo ver uma mensagem de erro', () => {
        cy.visit('http://automationpractice.com/index.php')

        //acessa tela de login /cadastro
        cy.get('a.login').click()

        //preenchimento de email já cadastrado e clique no botão de registrar
        cy.get('input#email_create').type('newmail123')
        cy.get('button#SubmitCreate').click()

        //assertion url da tela de cadastro
        cy.get('div#create_account_error').should('have.text', 'Invalid email address.')
    }),
    it('Quando não preencho informações do formulário e clico em registrar, então o cadastro não deve ser realizado', () => {
        cy.visit('http://automationpractice.com/index.php')

        //acessa tela de login /cadastro
        cy.get('a.login').click()

        //preenchimento de email de clique no botão de registrar
        cy.get('input#email_create').type(user.email)
        cy.get('button#SubmitCreate').click()

        //confirmar registro
        cy.get('button#submitAccount').click()

        //assertion de alert para
        cy.url().should('include', 'controller=authentication')
    }),
    it('Quando acesso a página de registro, informo os dados e confirmo, então o registro deve ser realizado', () => {
        cy.visit('http://automationpractice.com/index.php')

        //acessa tela de login /cadastro
        cy.get('a.login').click()

        //preenchimento de email de clique no botão de registrar
        cy.get('input#email_create').type(user.email)
        cy.get('button#SubmitCreate').click()

        //assertion de url de tela de registro
        cy.url().should('include', '#account-creation')

        //preenchimento do formulário de registro
        cy.get('input#id_gender1').check()
        cy.get('input#customer_firstname').type(user.name.first)
        cy.get('input#customer_lastname').type(user.name.last)
        cy.get('input#passwd').type('Senha@123')
        cy.get('select#days').select(`${chance.integer({min:1, max:30})}`)
        cy.get('select#months').select(`${chance.integer({min:1, max:12})}`)
        cy.get('select#years').select(`${chance.integer({min:1960, max:2003})}`)
        cy.get('input#address1').type(chance.address())
        cy.get('input#city').type(chance.city())
        cy.get('select#id_state').select(`${chance.integer({min:1,max:20})}`)
        cy.get('input#postcode').type(chance.integer({min:10000, max:99999}))
        cy.get('input#phone_mobile').type(chance.phone())
        cy.get('input#alias').type('Alias')

        //confirmar registro
        cy.get('button#submitAccount').click()

        //assertion do registro
        cy.url().should('include', 'controller=my-account')
        cy.get('.account > span').should('have.text', `${user.name.first} ${user.name.last}`)
    });
});