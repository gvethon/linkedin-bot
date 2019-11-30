const puppeteer = require('puppeteer');

(async () => {
    const args = process.argv.slice(2);
    const username = args[0]
    const password = args[1]
    console.log(`Login to LinkedIn as: ${username}`)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await login(page, username, password)

    await page.goto('https://www.linkedin.com/mynetwork/invitation-manager/')

    const invicationsCount = await getInvitationsCount(page);

    if (invicationsCount == '0') {
        console.log('Nothing to do.')
    } else {
        await acceptInvitations(page)
    }

    browser.close();
})()

const login = async (page, username, password) => {
    await page.goto('https://www.linkedin.com/login');

    await page.type('#username', username)
    await page.type('#password', password)

    await page.click('button[type="submit"]')
}

const getInvitationsCount = async (page) => {
    const acceptButtonText = await page.evaluate(() => {
        return document.querySelector('#mn-invitation-manager__invitation-facet-pills--').innerText
    });
    const invicationsCount = acceptButtonText.split(' ')[1].match('[0-9]+');
    console.log(`Found ${invicationsCount} invitations`)

    return invicationsCount
}

const acceptInvitations = async (page) => {
    await page.click('#contact-select-checkbox')
    await page.click('[data-control-name="accept_all"]');
    console.log('All invitations accepted')
}