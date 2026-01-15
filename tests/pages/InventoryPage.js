import { expect } from '@playwright/test';

export class InventoryPage {
    constructor(page) {
        this.page = page;
        this.inventoryList = this.page.locator('[data-test="inventory-item"]');
        this.cart = this.page.locator('[data-test="shopping-cart-link"]')
        this.sortContainer = this.page.locator('[data-test="product-sort-container"]')
    }

    async getProducts() {
        const count = await this.inventoryList.count();
        const products = [];
        for (let i = 0; i < count; i++) {
            const product = this.inventoryList.nth(i); 
            products.push(new Product(product))
        }
        return products;
    }

    async getCartBadgeValue() {
        const badge = this.cart.locator('[data-test="shopping-cart-badge"]');

        if (await badge.count() === 0) {
            return 0;
        }

        return Number(await badge.textContent());
    }

    async sortProducts(sortType) {
        this.sortContainer.selectOption(sortType);
    }

    async getProductNames() {
        const products = await this.getProducts();
        const names = [];
        for (const product of products) {
            names.push(await product.name.textContent());
        }
        return names;
    }

    async getProductPrices() {
        const products = await this.getProducts();
        const prices = [];
        for (const product of products) {
            const priceText = await product.price.textContent();
            const priceValue = parseFloat(priceText.replace('$', ''));
            prices.push(priceValue);
        }
        return prices;
    }

    async verifySortProducts(sortType) {
        const products = await this.getProducts();
        let values = [];
        for (const product of products) {
            if (sortType === "az" || sortType === "za") {
                values.push(await product.name.textContent());                
            } else {
                const priceText = await product.price.textContent();
                const priceValue = Number(priceText.replace('$', ''));
                values.push(priceValue);               
            }
        }

        let sortedValues;

        if (sortType === "az") {
            sortedValues = [...values].sort((a, b) => a.localeCompare(b));
        }

        if (sortType === "za") {
            sortedValues = [...values].sort((a, b) => b.localeCompare(a));
        }

        if (sortType === "lohi") {
            sortedValues = [...values].sort((a, b) => a - b);
        }

        if (sortType === "hilo") {
            sortedValues = [...values].sort((a, b) => b - a);
        }
        
        return JSON.stringify(values) === JSON.stringify(sortedValues);
    }

}

class BaseProduct {
    constructor(root) {
        this.root = root;        
        this.name = root.locator('[data-test="inventory-item-name"]');
        this.description = root.locator('[data-test="inventory-item-desc"]');
        this.price = root.locator('[data-test="inventory-item-price"]');
        this.addOrRemoveFromCartButton = root.locator('.btn_inventory');
    }

    async addToCart() {
        if (await this.addOrRemoveFromCartButton.textContent() === 'Add to cart') {            
            await this.addOrRemoveFromCartButton.click();
        }
    }

    async removeFromCart() {
        if (await this.addOrRemoveFromCartButton.textContent() === 'Remove') {            
            await this.addOrRemoveFromCartButton.click();
        }
    }

    async clickName() {
        await this.name.click();
    }

    async clickImage() {
        await this.image.click();
    }    

    async validatedCommonElements() {
        const elements = [this.name, this.description, this.price, this.addOrRemoveFromCartButton];
        for (const element of elements) {
            await expect(element).toBeVisible();
        } 
        await expect(this.addOrRemoveFromCartButton).toContainText(/Add to cart|Remove/);
    }
}

class Product extends BaseProduct {
    constructor(product) {
        super(product)        
        this.image = this.root.locator('.inventory_item_img img');        
    }

    async isVisible() {
        await this.validatedCommonElements();
        await expect(this.image).toBeVisible();
    }
}

export class ProductDetailsPage extends BaseProduct {
    constructor(page) {
        super(page)
        this.image = this.root.locator('.inventory_details_img');
        
}

    async isVisible() {
        await this.validatedCommonElements();
        await expect(this.image).toBeVisible();
    }
}