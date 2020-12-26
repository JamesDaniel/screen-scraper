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
        headless: true,
        // args: [
        //     '--start-maximized' // you can also use '--start-fullscreen'
        // ]
    }).then(async (browser) => {
        try {
            const page = await browser.newPage();
            await page.setViewport({
                width: 1800,
                height: 900,
                deviceScaleFactor: 1,
            });
            await page.goto('https://www.rent.ie/houses-to-let/renting_limerick/limerick-city-centre/2_beds/rent_0-1000/');
            await page.click('button[data-tracking=cc-accept]');
            await page.waitForTimeout(1000);

            const searchResults = await getSearchResults(page);
            
            let apartments = [];

            for (let i=0;i<searchResults.length;i++) {
                let link = await getLink(searchResults[i]);
                const apartment = {
                    linkText: await getLinkText(page, link),
                    linkUrl: await getLinkUrl(page, link),
                    isDoubleRoom: await isDouble(page, searchResults[i])
                }
                apartments.push(apartment);
            }

            apartments = apartments.filter(e => e.isDoubleRoom);
            console.log(JSON.stringify(apartments, null, 2));

            await page.waitForTimeout(30000);
        } catch (error) {
            console.error("Error navigating page." + error);
            throw new Error("Error navigating page");
        } finally {
            await browser.close();
        }
    });
}

async function getLink(searchResult) {
    let l = await searchResult.$$('a');
    return l[0];
}

async function getLinkText(page, link) {
    let value = await page.evaluate(el => el.textContent, link)
    return value.replace(/^\s+|\s+$/g, '');
}

async function getLinkUrl(page, link) {
    let value = await page.evaluate(el => el.getAttribute('href'), link)
    return value.replace(/^\s+|\s+$/g, '');
}

async function getSearchResults(page) {
    await page.waitForSelector('.search_result')
    return await page.$$('.search_result')
}

async function isDouble(page, searchResult) {
    let value = await page.evaluate(el => el.textContent, searchResult)
    return value.includes('2 double');
}