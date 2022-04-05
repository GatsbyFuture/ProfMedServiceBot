const { Composer } = require('telegraf');
const { bot } = require('../core/run');
const composer = new Composer();
const https = require('https');
const fs = require('fs');
const bot_token = "1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s";
composer.on('message', async (ctx) => {
    try {
        // ctx.reply('Salom');
        // console.log(ctx.update);
        // https.get(`https://api.telegram.org/file/bot${bot_token}/${ctx.update.message.document.file_id}`, (res) => {
        //     const fileStream = fs.createWriteStream(ctx.update.message.document.file_name);
        //     res.pipe(fileStream);
        //     fileStream.on('finish', () => {
        //         fileStream.close();
        //         console.log("Yuklandi!");
        //     });
        // });
        const respons = https.get(`https://api.telegram.org/file/bot${bot_token}/getFile?file_id=${ctx.update.message.document.file_id}`);
        console.log(respons.);
    } catch (err) {
        console.log(err);
    }
});

bot.use(composer.middleware())