const { Composer } = require('telegraf');
const { youWantConnect, pushContanct, main_buttons, allBaseBtn } = require('../controller/function');
const { bot } = require("../core/run");

const composer = new Composer();
// choise language actions...
composer.action('rus', async (ctx) => {
    try {
        if (ctx.session.checkUser) {
            ctx.i18n.locale('ru');
            await allBaseBtn(ctx);
        } else if (ctx.session.admin) {
            ctx.i18n.locale('ru');
            await main_buttons(ctx);
        } else {
            ctx.i18n.locale('ru');
            await youWantConnect(ctx);
        }
        ctx.deleteMessage();
    } catch (err) {
        console.log(err);
    }
});
composer.action('uz', async (ctx) => {
    try {
        if (ctx.session.checkUser) {
            ctx.i18n.locale('oz');
            await allBaseBtn(ctx);
        } else if (ctx.session.admin) {
            ctx.i18n.locale('oz');
            await main_buttons(ctx);
        } else {
            ctx.i18n.locale('oz');
            await youWantConnect(ctx);
        }
        ctx.deleteMessage();
    } catch (err) {
        console.log(err);
    }
});
composer.action('уз', async (ctx) => {
    try {
        if (ctx.session.checkUser) {
            ctx.i18n.locale('uz');
            await allBaseBtn(ctx);
        } else if (ctx.session.admin) {
            ctx.i18n.locale('uz');
            await main_buttons(ctx);
        } else {
            ctx.i18n.locale('uz');
            await youWantConnect(ctx);
        }
        ctx.deleteMessage();
    } catch (err) {
        console.log(err);
    }
});
// ask tel number of users...
composer.action('goru', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage();
    } catch (err) {
        console.log(err);
    }
});
composer.action('gouz', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage();
    } catch (err) {
        console.log(err);
    }
});
composer.action('goуз', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage();
    } catch (err) {
        console.log(err);
    }
});

bot.use(composer.middleware());