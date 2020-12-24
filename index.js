const puppeteer = require('puppeteer');

(async () => {
    while (true) {
        try {
            await visitPage();
        } catch (error) {
            console.log('Trying again');
        }
    }
})();

async function visitPage() {
    return puppeteer.launch({
        headless: false
    }).then(async (browser) => {
        try {
            const page = await browser.newPage();
            await page.goto('http://www.example.com');
            await page.waitForTimeout(5000)
        } catch (error) {
            console.error("Error navigating page." + error);
            throw new Error("Error navigating page");
        } finally {
            await browser.close();
        }
    });
}