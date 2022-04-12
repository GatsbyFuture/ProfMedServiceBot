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
} = require('../model/packData');
const {
    check_number,
    need_data,
    sleep_status,
    archive_data
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
    let result = await check_number(ctx.message.from.id, phoneNumber);
    if (result) {
        ctx.replyWithHTML("Marhamat xush kelibsiz!");
        await allBaseBtn(ctx);
        ctx.session.checkUser = true;
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
// arxivni ochish uchun function...
const archive = async (ctx) => {
    let create_btn = [];
    let all_btn = await archive_data();
    for (let i = 0; i < all_btn[0].length; i++) {
        create_btn.push([all_btn[0][i].date_month]);
    }
    ctx.session.allButton = await ctx.replyWithHTML("Marhamat arxive xizmati!",
        Markup.keyboard(
            create_btn
        )
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
    ctx.session.adminx = await ctx.replyWithHTML(ctx.i18n.t("addmin_desc"),
        Markup.keyboard([
            [ctx.i18n.t("send_file_btn"), ctx.i18n.t("read_file_btn")],
            [ctx.i18n.t("send_message_btn")],
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
    ctx.replyWithHTML(ctx.i18n.t('send_file_desc'));
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
                ctx.replyWithHTML(ctx.i18n.t('down_file'));
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
        // file yangi yuklanayotganda eski bazadagi malumotlarini o'chirib qo'yadi..
        await sleep_status();
        const workbook = XLSX.readFile(`E:/ProfMedServiceBot/archive/${ctx.session.file_name}`);
        const workbookSheets = workbook.SheetNames;
        // console.log(workbookSheets);
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        // console.log(dataExcel);
        // Kelgan malumotini datasini yozadi...
        await data_dateW(dataExcel[0]);
        // Kelgan user datalarini yozadi...
        for (let i = 2; i < dataExcel.length - 1; i++) {
            await data_userW(dataExcel[0], dataExcel[i]);
        }
        // Kelgan ITOGO ni datasini yozish...
        await data_reportW(dataExcel[0], dataExcel[dataExcel.length - 1]);
        ctx.replyWithHTML(ctx.i18n.t('copy_file_data'));
        setTimeout(() => {
            fs.unlink(`E:/ProfMedServiceBot/archive/${ctx.session.file_name}`, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        }, 3000);
    } catch (err) {
        console.log("Fileni o'qib olishda xatolik :" + err);
    }
}
// oylik xisobotni userga chiqarib berish uchun...
const show_data = async (ctx) => {
    try {
        let data = await need_data(ctx.message.from.id);
        if (data.length == 1) {
            ctx.replyWithHTML(ctx.i18n.t("show_user")
                .replace('{n1}', data[0]["name_date"])
                .replace('{n2}', data[0]["Сотрудники"] == null ? "❌" : data[0]["Сотрудники"])
                .replace('{n3}', data[0]["Кол_во_выходов"] == null ? "❌" : data[0]["Кол_во_выходов"])
                .replace('{n4}', data[0]["Кол_во_отраб"] == null ? "❌" : data[0]["Кол_во_отраб"])
                .replace('{n5}', data[0]["Кол_во_Дежурства_день"] == null ? "❌" : data[0]["Кол_во_Дежурства_день"])
                .replace('{n6}', data[0]["Кол_о_Дежурства_ночь"] == null ? "❌" : data[0]["Кол_о_Дежурства_ночь"])
                .replace('{n7}', data[0]["Оклад"] == null ? "❌" : data[0]["Оклад"])
                .replace('{n8}', data[0]["За_вредность"] == null ? "❌" : data[0]["За_вредность"])
                .replace('{n9}', data[0]["Дежурства_день"] == null ? "❌" : data[0]["Дежурства_день"])
                .replace('{n10}', data[0]["Дежурства_ночь"] == null ? "❌" : data[0]["Дежурства_ночь"])
                .replace('{n11}', data[0]["Отпускные"] == null ? "❌" : data[0]["Отпускные"])
                .replace('{n12}', data[0]["Доплата"] == null ? "❌" : data[0]["Доплата"])
                .replace('{n13}', data[0]["Премия"] == null ? "❌" : data[0]["Премия"])
                .replace('{n14}', data[0]["Всего_ачислено"] == null ? "❌" : data[0]["Всего_ачислено"])
                .replace('{n15}', data[0]["Подоходный_налог"] == null ? "❌" : data[0]["Подоходный_налог"])
                .replace('{n16}', data[0]["Займ"] == null ? "❌" : data[0]["Займ"])
                .replace('{n17}', data[0]["Всего_удержано"] == null ? "❌" : data[0]["Всего_удержано"])
                .replace('{n18}', data[0]["creation_date"].toString())
            );
        } else {
            await start_fun(ctx);
            ctx.deleteMessage(ctx.session.allButton);
            ctx.session.checkUser = false;
        }
    } catch (err) {
        console.log("So'ngi oylik xisobotni chiqarishda xatolik :" + err);
    }
}
module.exports = {
    start_fun,
    youWantConnect,
    pushContanct,
    sendContact,
    allBaseBtn,
    mainThree,
    // arxivni ko'rish uchun...
    archive,
    // admin panel ...
    main_buttons,
    send_excel,
    down_excel,
    read_excel,
    show_data
}