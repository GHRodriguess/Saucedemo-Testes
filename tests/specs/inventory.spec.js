import {test, expect} from '@playwright/test';
import {InventoryPage} from '../pages/InventoryPage';

test.describe('Inventory Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/inventory.html');
    })

    test('verifica se os produtos estao visiveis na pagina de inventario', async ({page}) => {
        const inventoryPage = new InventoryPage(page);


    })
})