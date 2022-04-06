const { Composer } = require('telegraf');
const { bot } = require('../core/run');
const composer = new Composer();
const axios = require('axios').default;
const https = require('https');
const fs = require('fs');
const bot_token = "1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s";
composer.on('message', async (ctx) => {
    try {
        let file_path = undefined;
        await axios.post(`https://api.telegram.org/bot1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s/getFile?file_id=${ctx.update.message.document.file_id}`)
            .then((result) => {
                // console.log(result.data.result.file_path);
                if (result.status == 200)
                    file_path = result.data.result.file_path;
            })
            .catch((err) => {
                console.log(err);
            })
        https.get(`https://api.telegram.org/file/bot1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s/${file_path}`, (res) => {
            const fileStream = fs.createWriteStream(`E:/ProfMedServiceBot/archive/${ctx.update.message.document.file_name}`);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log("Yuklandi!");
            });
        });
    } catch (err) {
        console.log(err);
    }
});

bot.use(composer.middleware())