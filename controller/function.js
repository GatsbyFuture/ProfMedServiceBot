// there are all function in this page...
const { bot } = require("../core/run");
const axios = require('axios').default;
const Extra = require('telegraf/extra');
const Markup = require("telegraf/markup");
const https = require('https');
const XLSX = require('xlsx');
const fs = require('fs');
const {
    data_dateW,
    data_userW,
    data_reportW
} = require('../model/crudData');
// start bosganda ishga tushadigan function...
const start_fun = async (ctx) => {
    await ctx.replyWithHTML("<b>Tilni tanlang | Тилни танланг \n Выберите язык ⬇️</b>",
        Extra.markup(
            Markup.inlineKeyboard([
                [Markup.callbackButton(`🇷🇺  Rus`, `rus`)],
                [Markup.callbackButton(`🇺🇿  Uzb`, `uz`)],
                [Markup.callbackButton(`🇺🇿  Узб`, `уз`)]
            ])
        )
    ).then();
}
// ask contact of users...
const youWantConnect = async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t('description'),
        Extra.markup(
            Markup.inlineKeyboard([
                [Markup.callbackButton(`${ctx.i18n.t('lang')} 📝`, ctx.i18n.t('keyLang'))]
            ])
        )
    )
        .then();
}
// take phone number or go back menu...
const pushContanct = async (ctx) => {
    ctx.session.consoleCon = await ctx.replyWithHTML(ctx.i18n.t('questionPhone'),
        Markup.keyboard([
            [{
                text: ctx.i18n.t('sendContact'),
                request_contact: true
            }],
            [ctx.i18n.t('sendConConsole')]
        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
}
// check users phon number, They have number or not...
const sendContact = async (ctx, phoneNumber) => {
    ctx.deleteMessage(ctx.session.consoleCon.message_id);
    // bazadan userni qidiradi tel nomeri bo'yicha keyin qo'lsa true or false
    if (true) {
        await allBaseBtn(ctx);
    } else {
        ctx.replyWithHTML("Sizni so'rovingiz qabul qilinmadi Bugalter bilan uchrashing");
    }
}
// open the main menu...
const allBaseBtn = async (ctx) => {
    ctx.session.exit_type = false;
    ctx.session.allButton = await ctx.replyWithHTML(ctx.i18n.t('mainFuntion3'),
        Markup.keyboard([
            [ctx.i18n.t('mainFuntion0'), ctx.i18n.t('mainFuntion1')],
            [ctx.i18n.t('mainFuntion2')]
        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
}
// want to change language...
const mainThree = async (ctx) => {
    try {
        if (ctx.session.exit_type) {
            ctx.deleteMessage(ctx.session.adminx.message_id);
            ctx.session.adminx = undefined;
        } else {
            ctx.deleteMessage(ctx.session.allButton.message_id);
            ctx.session.allBaseBtn = undefined;
        }
        await start_fun(ctx);
    } catch (err) {
        console.log(err);
    }
}
// Admin panel uchun functions
const main_buttons = async (ctx) => {
    ctx.session.exit_type = true;
    ctx.session.adminx = await ctx.replyWithHTML("Marhamat xush kelibsiz!",
        Markup.keyboard([
            ["🗂  Excel file jo'natish", "📨 File taqdim etish"],
            ["📤 Xabar jo'natish"],
            // ["🔍 Qidirish"],
            [ctx.i18n.t('mainFuntion2')]

        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
}
// Excel fayilni jo'natishga tayorgarlik...
const send_excel = async (ctx) => {
    ctx.replyWithHTML("<code>Excel file ni yuboring !</code>");
    setTimeout(() => {
        ctx.session.rideFile = true;
    }, 1000);
    ctx.deleteMessage(ctx.session.adminx.message_id);
}
// Excel fayilni yuklab olish...
const down_excel = async (ctx) => {
    try {
        let file_path = undefined;
        await axios.post(`https://api.telegram.org/bot1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s/getFile?file_id=${ctx.update.message.document.file_id}`)
            .then((result) => {
                // console.log(result.data.result.file_path);
                if (result.status == 200) {
                    file_path = result.data.result.file_path;
                    console.log(file_path);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        https.get(`https://api.telegram.org/file/bot1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s/${file_path}`, (res) => {
            const fileStream = fs.createWriteStream(`E:/ProfMedServiceBot/archive/${ctx.update.message.document.file_name}`);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                ctx.replyWithHTML("✅ <code>File muvofaqiyatli yuklandi!</code>");
                // console.log("Yuklandi!");
            });
        });
        return ctx.update.message.document.file_name;
    } catch (err) {
        console.log("Fileni yuklashda xatolik: " + err);
    }
}
// Excelni fileni malumotlarini o'tib olish...
const read_excel = async (ctx) => {
    try {
        const workbook = XLSX.readFile(`E:/ProfMedServiceBot/archive/${ctx.session.file_name}`);
        const workbookSheets = workbook.SheetNames;
        // console.log(workbookSheets);
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log(dataExcel);
        // Kelgan malumotini datasini yozadi...
        await data_dateW(dataExcel[0]);
        // Kelgan user datalarini yozadi...
        await data_userW(ctx,dataExcel[0],dataExcel[5]);
        // Kelgan ITOGO ni datasini yozish...
        await data_reportW(dataExcel[0],dataExcel[dataExcel.length-1]);
        
    } catch (err) {
        console.log("Fileni o'qib olishda xatolik :" + err);
    }
}
module.exports = {
    start_fun,
    youWantConnect,
    pushContanct,
    sendContact,
    allBaseBtn,
    mainThree,
    // admin panel ...
    main_buttons,
    send_excel,
    down_excel,
    read_excel
}