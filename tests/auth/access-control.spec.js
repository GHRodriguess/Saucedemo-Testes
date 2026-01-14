import { test, expect} from '@playwright/test';
import {AcessControl} from '../helpers/AccessControl';

test.describe('Access Control Tests', () => {
    const protectedRoutes = [
        {
            name: 'Página Inventário',
            url: 'https://www.saucedemo.com/inventory.html'

        },
        {
            name: 'Página carrinho',
            url: 'https://www.saucedemo.com/cart.html'
        },
        {
            name: 'Página Checkout 1',
            url: 'https://www.saucedemo.com/checkout-step-one.html'
        },
        {
            name: 'Página Checkout 2',
            url: 'https://www.saucedemo.com/checkout-step-two.html'
        },
        {
            name: 'Página Checkout Completo',
            url: 'https://www.saucedemo.com/checkout-complete.html'
        }
    ]

    protectedRoutes.forEach(({name, url}) => {
        test(`Tentando acessar ${name} sem estar logado`, async ({page}) => {
            const accessControl = new AcessControl(page);
            await page.goto(url);

            await expect(page).toHaveURL('https://www.saucedemo.com/');
            await expect(accessControl.errorMesage).toContainText(/when you are logged in/)
        })
    })

}
)