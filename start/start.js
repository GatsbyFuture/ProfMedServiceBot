const { Composer } = require('telegraf');
const { start_fun } = require('../controller/function');
const { bot } = require('../core/run');
const composer = new Composer();

composer.start(async (ctx) => {
    // ctx.reply('Marhamat xush kelibsiz!');
    try {
        // choice language...
        // check databases
        await start_fun(ctx);
        ctx.session.checkUser = false;
        ctx.session.rideFile = undefined;
    } catch (err) {
        console.log(err);
    }
});

bot.use(composer.middleware())