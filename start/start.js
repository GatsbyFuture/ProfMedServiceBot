const { Composer } = require('telegraf');
const { bot } = require('../core/run');
const composer = new Composer();

composer.start(async (ctx) => {
    ctx.reply('Marhamat xush kelibsiz!');
});

bot.use(composer.middleware())