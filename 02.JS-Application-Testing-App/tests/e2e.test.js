const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000';

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

let recipeName = "";

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        test("registration with valid data", async () => {
            //Arrange
            await page.goto(host);
            await page.click("//a[@href='/register']");
            await page.waitForSelector("//form");

            //Act
            let random = Math.floor(Math.random() * 1000);
            user.email = `email_${random}@abv.bg`;

            await page.locator("//input[@name='email']").fill(user.email);
            await page.locator("//input[@name='password']").fill(user.password);
            await page.locator("//input[@name='conf-pass']").fill(user.confirmPass);
            await page.click("//button[text()='Register']");

            //Assert
            if(page.locator("//a[@href='/logout']").isVisible())
            {
                await expect(page.locator("//a[@href='/logout']")).toBeVisible();
                expect(page.url()).toBe(host + "/");
            }
            else (
                test.fail()
            )
        })

        test("login with valid data", async () => {
            //Arrange
            await page.goto(host);
            await page.click("//a[@href='/login']");
            await page.waitForSelector("//form");

            //Act
            await page.fill("//input[@name='email']", user.email);
            await page.fill("//input[@type='password']", user.password);
            await page.click("//button[text()='Login']");

            //Asserts
            await expect(page.locator("//a[text()='Logout']")).toBeVisible();
            expect(page.url()).toBe(host + "/");
        })

        test("logout from the application", async ()=> {
            //Arrange
            await page.goto(host);
            await page.click("//a[@href='/login']");
            await page.waitForSelector("//form");

            await page.fill("//input[@name='email']", user.email);
            await page.fill("//input[@type='password']", user.password);
            await page.click("//button[text()='Login']");

            //Act
            await page.click("//a[text()='Logout']");

            //asserts
            await expect(page.locator("//a[text()='Login']")).toBeVisible();
            expect(page.url()).toBe(host + "/")
        })

    });

    describe("navbar", () => {
		test("navigation for logged in users", async () => {
            //Arrange
            await page.goto(host);
            await page.click("//a[@href='/login']");
            await page.waitForSelector("//form");

            //Act
            await page.fill("//input[@name='email']", user.email);
            await page.fill("//input[@type='password']", user.password);
            await page.click("//button[text()='Login']");


            //Asserts
            await expect(page.locator("//a[text()='Home']")).toBeVisible();
            await expect(page.locator("//a[text()='Discover']")).toBeVisible();
            await expect(page.locator("//a[text()='Search']")).toBeVisible();
            await expect(page.locator("//a[text()='Create Recipe']")).toBeVisible();
            await expect(page.locator("//a[text()='Logout']")).toBeVisible();

            await expect(page.locator("//a[text()='Login']")).toBeHidden();
            await expect(page.locator("//a[text()='Register']")).toBeHidden();
        })

        test("navigation for non-logged in users", async () => {
            //Arrange
            await page.goto(host);

            //Asserts
            await expect(page.locator("//a[text()='Home']")).toBeVisible();
            await expect(page.locator("//a[text()='Discover']")).toBeVisible();
            await expect(page.locator("//a[text()='Search']")).toBeVisible();
            await expect(page.locator("//a[text()='Create Recipe']")).toBeHidden();
            await expect(page.locator("//a[text()='Logout']")).toBeHidden();

            await expect(page.locator("//a[text()='Login']")).toBeVisible();
            await expect(page.locator("//a[text()='Register']")).toBeVisible();
        })
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.click("//a[@href='/login']");
            await page.waitForSelector("//form");

            await page.fill("//input[@name='email']", user.email);
            await page.fill("//input[@type='password']", user.password);
            await page.click("//button[text()='Login']");
        })

		test("Create an recipe", async () => {
            //Arrange
            await page.click("//a[text()='Create Recipe']");
            await page.waitForSelector("//form");

            //Act
            let random = Math.floor(Math.random() * 10000);
            recipeName = `RecipeName_${random}`;

            await page.locator("//input[@name='recipeName']").fill(recipeName);
            await page.locator("//input[@name='recipeImage']").fill("/images/chicken_curry.jpg");
            await page.locator("//input[@name='preparationTime']").fill("15");
            await page.locator("//input[@name='sharedBy']").fill("SomeUser");
            await page.locator("//input[@name='cuisineType']").fill("Standart");
            await page.locator("//textarea[@name='steps']").fill("SomeSteps");
            await page.click("//button[text()='Save']");

            //Assert
            await expect(page.locator("//div[@class='recipe-details']//h2", {hasText: recipeName})).toHaveCount(1);
            expect(page.url()).toBe(host + "/discover");
        })

        test("edit recipe", async () => {
            //arrange
            await page.click("//a[text()='Search']");
            await page.fill("//input[@name='search']", recipeName);
            await page.click("//button[text()='Search']");
            recipeName = "Edited_" + recipeName;

            //Act
            await page.click("//html/body/main/div/section/ul/li/a", {timeout:10000});
            await page.click("//a[@class='edit-btn']");
            await page.waitForSelector('//form');
            await page.locator("//input[@id='recipeName']").fill(recipeName);
            await page.click("//button[@type='submit']");

            //Asserts
            await expect(page.locator("//h2", {hasText: recipeName})).toHaveCount(1);
        })

        test("delete recipe", async () => {
            //arrange
            await page.click("//a[text()='Search']");
            await page.fill("//input[@name='search']", recipeName);
            await page.click("//button[text()='Search']");

            //Act
            await page.click("//html/body/main/div/section/ul/li/a", {timeout:10000});
            await page.click("//a[@class='delete-btn']");

            //Asserts
            await expect(page.locator("//div[@class='recipe-details']//h2", {hasText: recipeName})).toHaveCount(0);
            expect(page.url()).toBe(host + "/discover")
        })
    });
});