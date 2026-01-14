// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/')
    })

    test('teste de login com sucesso', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.login('standard_user', 'secret_sauce')

        await expect(page).toHaveTitle(/Swag Lab/)
        await expect(page).toHaveURL(/inventory/)
        await page.context().storageState({ path: 'storageState.json' });

    })

    const loginInvalidCases = [
        {
            name: 'usuario certo senha errada',
            username: 'standard_user',
            password: 'wrong_password',
            errorMessage: /Username and password do not match/
        },
        {
            name: 'usuario errado senha certa',
            username: 'wrong_user',
            password: 'secret_sauce',
            errorMessage: /Username and password do not match/
        },
        {
            name: 'usuario errado senha errada',
            username: 'wrong_user',
            password: 'wrong_password',
            errorMessage: /Username and password do not match/
        }
    ]

    loginInvalidCases.forEach(({name, username, password, errorMessage}) => {
        test(`teste de login com erro - ${name}`, async ({page}) => {
            const loginPage = new LoginPage(page);
            await loginPage.login(username, password)

            await expect(loginPage.errorMessage).toContainText(errorMessage)
        })
    })


    test('envio sem usuario e senha', async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginButton.click()

        await expect(loginPage.errorMessage).toContainText(/Username is required/)
    }
    )

    test('envio com usario sem senha', async ({page}) => {
        const loginPage = new LoginPage(page);

        await loginPage.usernameInput.fill('standard_user')
        await loginPage.loginButton.click()
        await expect(loginPage.errorMessage).toContainText(/Password is required/)
    }
    )

    test('envio só com senha', async ({page}) => {
        const loginPage = new LoginPage(page);

        await loginPage.passwordInput.fill('secret_sauce')
        await loginPage.loginButton.click()
        await expect(loginPage.errorMessage).toContainText(/Username is required/)
    }
    )

    test('usuario bloqueado', async({page}) => {
        const loginPage = new LoginPage(page);

        await loginPage.login('locked_out_user', 'secret_sauce')
        await expect(loginPage.errorMessage).toContainText(/Sorry, this user has been locked out./)
    })

});