const { Telegraf } = require('telegraf');
const session = require("telegraf/session");
const bot = new Telegraf("1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s");
// Middleware functions ...
// bot.use(Telegraf.log());
bot.use(session());
// chack the bot, it is working or not
bot
    .launch()
    .then(() => {
        console.log("ProfMedService ishga tushdi...");
    })
    .catch((err) => {
        console.log("bot ishga tushishida xatolik..." + err);
    });
module.exports = {
    bot
}