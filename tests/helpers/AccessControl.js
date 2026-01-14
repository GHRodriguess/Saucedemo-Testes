export class AcessControl {
    constructor(page) {
        this.page = page;
        this.errorMesage = page.locator('[data-test="error"]');
    }
}