import {test, expect} from '@playwright/test';
import {InventoryPage, ProductDetailsPage } from '../pages/InventoryPage';

test.describe('Inventory Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/inventory.html');
        const inventoryTitle = page.locator('.title');

        if (!(await inventoryTitle.isVisible())) {
            throw new Error('Usuário não está logado. Rode o teste de "login com sucesso" para atualizar o "storageState.json".');
        }
    })

    test('verifica se os produtos estao visiveis na pagina de inventario', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        const products = await inventoryPage.getProducts();
        for (const product of products) {
            await product.isVisible();
        }
    })

    test('verifica a funcionalidade de adicionar e remover produtos do carrinho', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        const products = await inventoryPage.getProducts();
        let cartBadgeValue = await inventoryPage.getCartBadgeValue();        
        for (const product of products) {
            await product.addToCart();
            cartBadgeValue = await inventoryPage.getCartBadgeValue();            
            expect(cartBadgeValue).toBeGreaterThan(0);         
            await product.removeFromCart();
            cartBadgeValue = await inventoryPage.getCartBadgeValue();
            expect(cartBadgeValue).toBe(0);  
        }
    })

    test('verifica se o clique nos produtos redireciona para a pagina de detalhes', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        const products = await inventoryPage.getProducts();
        for (const product of products) {
            await product.clickName();
            await expect(page).toHaveURL(/inventory-item/);            
            const productDetailsPage = new ProductDetailsPage(page.locator('[data-test="inventory-item"]'));
            await productDetailsPage.isVisible();
            await page.goBack();
            
            await product.clickImage();
            await expect(page).toHaveURL(/inventory-item/);   
            await productDetailsPage.isVisible();       
            await page.goBack();    
        }
    }) 

    const sortTypes = [
        {
            label: "Name (A to Z)", value: "az"
        },
        {
            label: "Name (Z to A)", value: "za"
        },
        {
            label: "Price (low to high)", value: "lohi"
        },
        {
            label: "Price (high to low)", value: "hilo"
        }
    ]

    for (const sort of sortTypes) {
        test(`verifica a ordenação dos produtos por ${sort.label}`, async ({page}) => {
            const inventoryPage = new InventoryPage(page);
            await inventoryPage.sortProducts(sort.value);
            const products = await inventoryPage.getProducts();
            for (const product of products) {
                await product.isVisible();
            }

            const isSorted = await inventoryPage.verifySortProducts(sort.value);
            expect(isSorted).toBe(true)
            
        })
    }
})

test.describe('Detail Page Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('https://www.saucedemo.com/inventory.html');
        const inventoryTitle = page.locator('.title');

        if (!(await inventoryTitle.isVisible())) {
            throw new Error('Usuário não está logado. Rode o teste de "login com sucesso" para atualizar o "storageState.json".');
        }
    })

    test('verifica se as informacoes dos produtos estao corretas', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        const products = await inventoryPage.getProducts();
        for (const product of products) {
            const name = await product.name.textContent();
            const description = await product.description.textContent();
            const price = await product.price.textContent();
            await product.clickImage();
            await expect(page).toHaveURL(/inventory-item/); 
            const productDetailsPage = new ProductDetailsPage(page.locator('[data-test="inventory-item"]'));
            await productDetailsPage.isVisible();

            const detailName = await productDetailsPage.name.textContent();
            const detailDescription = await productDetailsPage.description.textContent();
            const detailPrice = await productDetailsPage.price.textContent();

            
            expect(name).toBe(detailName);
            expect(description).toBe(detailDescription);
            expect(price).toBe(detailPrice);
            await page.goBack();

        }
    })

    test('verifica a funcionalidade de adicionar e remover produtos do carrinho na tela detalhes', async ({page}) => {
        const inventoryPage = new InventoryPage(page);
        const products = await inventoryPage.getProducts();
        let cartBadgeValue = await inventoryPage.getCartBadgeValue();        
        for (const product of products) {
            await product.clickImage();
            const productDetailsPage = new ProductDetailsPage(page.locator('[data-test="inventory-item"]'));
            await productDetailsPage.addToCart();
            cartBadgeValue = await inventoryPage.getCartBadgeValue();            
            expect(cartBadgeValue).toBeGreaterThan(0);         
            await productDetailsPage.removeFromCart();
            cartBadgeValue = await inventoryPage.getCartBadgeValue();
            expect(cartBadgeValue).toBe(0);  
            await page.goBack();
        }
    })

})