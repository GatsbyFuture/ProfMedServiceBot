const { Composer } = require('telegraf');
const { youWantConnect, pushContanct, main_buttons, allBaseBtn, show_data_board } = require('../controller/function');
const Extra = require('telegraf/extra');
const Markup = require("telegraf/markup");
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
        ctx.deleteMessage().then();;
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
        ctx.deleteMessage().then();;
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
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
// ask tel number of users...
composer.action('goru', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
composer.action('gouz', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
composer.action('goуз', async (ctx) => {
    try {
        await pushContanct(ctx);
        ctx.deleteMessage().then();;
    } catch (err) {
        console.log(err);
    }
});
// Arxiv ro'yxatidan ortga qaytish...
composer.action("exitBoard", async (ctx) => {
    try {
        ctx.deleteMessage().then();
        await allBaseBtn(ctx);
        ctx.session.show_board = undefined;
    } catch (err) {
        console.log("Arxiv ro'yxatidan ortga chiqarishda xatolik: " + err);
    }
});
// Arxivni keyingi oyga o'tkazish ...
composer.action("nextBoard", async (ctx) => {
    try {
        // console.log(ctx.session.count);
        if (ctx.session.count < ctx.session.show_board[0].length - 1) {
            ++ctx.session.count;
            let data = await show_data_board(ctx, ctx.session.show_board[0][ctx.session.count]);
            await ctx.editMessageText(data, {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('⬅️', 'backBoard'),
                        Markup.callbackButton('❌', 'exitBoard'),
                        Markup.callbackButton('➡️', 'nextBoard'),
                    ],
                ])
            }).then();
        } else {
            await ctx.answerCbQuery('Oxirgi arxive !');
        }
    } catch (err) {
        console.log("Arxiv ro'yxatini oldinga harakatida xatolik: " + err);
    }
});
// Arxivni oldingi oyga o'tkazish...
composer.action("backBoard", async (ctx) => {
    try {
        // console.log(ctx.session.count);
        if (0 < ctx.session.count) {
            --ctx.session.count;
            let data = await show_data_board(ctx, ctx.session.show_board[0][ctx.session.count]);
            await ctx.editMessageText(data, {
                reply_markup: Markup.inlineKeyboard([
                    [
                        Markup.callbackButton('⬅️', 'backBoard'),
                        Markup.callbackButton('❌', 'exitBoard'),
                        Markup.callbackButton('➡️', 'nextBoard'),
                    ],
                ])
            }).then();
        } else {
            await ctx.answerCbQuery('Birinchi arxive !');
        }
    } catch (err) {
        console.log("Arxiv ro'yxatini ortga harakatida xatolik: " + err);
    }
});
bot.use(composer.middleware());