const puppeteer = require("puppeteer");
const path = require('path');

let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
}, 30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe("Google fonts CDN", () => {
    it("Page is using Google fonts", async () => {
        const cdn = await page.$eval('link', el => el.href);
        expect(cdn).toMatch(/googleapis/);
    });
});

describe("Font weight", () => {
    it("Multiple different font weights are used", async () => {
        const fontWeights = await page.$$eval('*', el => Array.from(el).map(e => getComputedStyle(e).getPropertyValue('font-weight')));
        expect(fontWeights).toEqual(expect.arrayContaining(['300', '400', '700']));
    });
});

describe("H1 Styling", () => {
    it("H1 headline is underlined", async () => {
        const h1 = await page.$eval('h1', el => getComputedStyle(el).textDecoration);
        expect(h1).toMatch(/underline/);
    });
});

describe("List items", () => {
    it("List items have a light font weight", async () => {
        const listItems = await page.$$('li');
        expect(listItems.length).toBeGreaterThan(1);
        for (let i = 0; i < listItems.length; i++) {
            const li = await page.$eval('li', el => getComputedStyle(el).fontWeight);
            expect(li).toBe('300');
        }
    });
});

describe("Heading styling", () => {
    it("`.heading` has a shadow and is in uppercase", async () => {
        const headings = await page.$$('.heading');
        expect(headings.length).toBeGreaterThan(1);
        for (let i = 0; i < headings.length; i++) {
            const shadow = await page.$eval('.heading', el => getComputedStyle(el).textShadow);
            expect(shadow).toBeTruthy();
            const headingUpper = await page.$eval('.heading', el => getComputedStyle(el).textTransform);
            expect(headingUpper).toBe('uppercase');

        }
    });
});

describe("`.note` styling", () => {
    it("`.note` has `bold` font weight and is `italic`", async () => {
        const noteBold = await page.$eval('.note', el => getComputedStyle(el).fontWeight);
        expect(noteBold).toBe('700');
        const noteItalic = await page.$eval('.note', el => getComputedStyle(el).fontStyle);
        expect(noteItalic).toBe('italic');
    });
});
describe("To-do items", () => {
    it("`.todo-item` is striken through", async () => {
        const todoItem = await page.$eval('.todo-item', el => getComputedStyle(el).textDecoration);
        expect(todoItem).toMatch(/line-through/);
    });
});