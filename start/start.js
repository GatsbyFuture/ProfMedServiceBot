const { Composer } = require('telegraf');
const { start_fun } = require('../controller/function');
const { check_user } = require('../model/crudData');
const { bot } = require('../core/run');
const composer = new Composer();

composer.start(async (ctx) => {
    // ctx.reply('Marhamat xush kelibsiz!');
    try {
        // choice language...
        // check databases
        let check = await check_user(ctx.message.from.id);
        if (check)
            ctx.session.checkUser = true;
        else
            ctx.session.checkUser = false;
        await start_fun(ctx);
        // boshlang'ich default holatlar uchun...
        ctx.session.rideFile = undefined;
        ctx.session.send_m = undefined;
    } catch (err) {
        console.log(err);
    }
});

bot.use(composer.middleware())