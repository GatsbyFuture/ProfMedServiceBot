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
    archive_data,
    all_users_id,
    check_user,
    data_user
} = require('../model/crudData');
String.prototype.insert = function (index, string) {
    var ind = index < 0 ? this.length + index : index;
    return this.substring(0, ind) + string + this.substring(ind);
};
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
    await ctx.replyWithHTML(ctx.i18n.t('questionPhone'),
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
    // bazadan userni qidiradi tel nomeri bo'yicha keyin qo'lsa true or false
    let result = await check_number(ctx.message.from.id, phoneNumber);
    if (result) {
        ctx.replyWithHTML("Marhamat xush kelibsiz!");
        await allBaseBtn(ctx);
        ctx.session.checkUser = true;
    } else {
        await ctx.reply(
            ctx.i18n.t('load'),
            {
                parse_mode: "markdown",
                reply_markup: { remove_keyboard: true },
            }
        );
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
// arxivdan malumotlarni tortib kelish va taqdim etish...
const show_archive = async (ctx) => {
    try {
        await ctx.reply(
            ctx.i18n.t('load'),
            {
                parse_mode: "markdown",
                reply_markup: { remove_keyboard: true },
            }
        );
        let data = await need_data(ctx.message.from.id);
        // console.log(data);
        if (data.length == 1) {
            ctx.session.count = 0;
            ctx.session.show_board = await archive_data(ctx.message.from.id);
            // console.log(ctx.session.show_board[0]);
            const show_board0 = await show_data_board(ctx, ctx.session.show_board[0][ctx.session.count]);
            await ctx.telegram
                .sendMessage(ctx.message.from.id,
                    show_board0, {
                    reply_markup: Markup.inlineKeyboard([
                        [
                            Markup.callbackButton('⬅️', 'backBoard'),
                            Markup.callbackButton('❌', 'exitBoard'),
                            Markup.callbackButton('➡️', 'nextBoard'),
                        ],
                    ])
                })
                .then();
        } else {
            await start_fun(ctx);
            ctx.session.checkUser = false;
        }
    } catch (err) {
        console.log("Arxivning boardini chiqarishda xatolik: " + err);
    }
}
// want to change language...
const mainThree = async (ctx) => {
    try {
        if (ctx.session.exit_type) {
            await ctx.reply(
                ctx.i18n.t('load'),
                {
                    parse_mode: "markdown",
                    reply_markup: { remove_keyboard: true },
                }
            );
            ctx.session.adminx = undefined;
        } else {
            await ctx.reply(
                ctx.i18n.t('load'),
                {
                    parse_mode: "markdown",
                    reply_markup: { remove_keyboard: true },
                }
            );
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
    await ctx.replyWithHTML(ctx.i18n.t("addmin_desc"),
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
// send post ...
const send_post = async (ctx) => {
    await ctx.replyWithHTML(ctx.i18n.t('correct_message'),
        Markup.keyboard([
            [ctx.i18n.t("send_post")],
            [ctx.i18n.t("post_cancel")],
        ])
            .oneTime()
            .resize()
            .extra()
    )
        .then();
    ctx.session.send_m = undefined;
}
// Excel fayilni jo'natishga tayorgarlik...
const send_excel = async (ctx) => {
    ctx.replyWithHTML(ctx.i18n.t('send_file_desc'));
    setTimeout(() => {
        ctx.session.rideFile = true;
    }, 500);
    if (ctx.session.adminx)
        await ctx.reply(
            ctx.i18n.t('load'),
            {
                parse_mode: "markdown",
                reply_markup: { remove_keyboard: true },
            }
        );
}
// Excel fayilni yuklab olish...
const down_excel = async (ctx) => {
    try {
        let file_path = undefined;
        await axios.post(`https://api.telegram.org/bot5396656344:AAE7hHNsFwhcmeAHM9mTxiYHvIqOMoD2PAc/getFile?file_id=${ctx.update.message.document.file_id}`)
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
        https.get(`https://api.telegram.org/file/bot5396656344:AAE7hHNsFwhcmeAHM9mTxiYHvIqOMoD2PAc/${file_path}`, (res) => {
            const fileStream = fs.createWriteStream(`D:/Profmedservice/archive/${ctx.update.message.document.file_name}`);
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
        const workbook = XLSX.readFile(`D:/Profmedservice/archive/${ctx.session.file_name}`);
        const workbookSheets = workbook.SheetNames;
        // console.log(workbookSheets);
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        // console.log(dataExcel);
        // Kelgan malumotini datasini yozadi...
        for (let key in dataExcel[0]) {
            await data_dateW(key);
        }
        // Kelgan user datalarini yozadi...
        for (let key in dataExcel[0]) {
            for (let i = 2; i < dataExcel.length - 1; i++) {
                await data_userW(key, dataExcel[i]);
            }
        }
        // Kelgan ITOGO ni datasini yozish...
        // await data_reportW(dataExcel[0], dataExcel[dataExcel.length - 1]);
        ctx.replyWithHTML(ctx.i18n.t('copy_file_data'));
        setTimeout(() => {
            fs.unlink(`D:/Profmedservice/archive/${ctx.session.file_name}`, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        }, 3000);
    } catch (err) {
        console.log("Fileni o'qib olishda xatolik :" + err);
    }
}
// barcha userlarga chatni automatik tarzda yuborish...
const send_message = async (ctx) => {
    try {
        let users_id = await all_users_id();
        // console.log(users_id);
        // ctx.replyWithHTML(ctx.i18n.t('accept_message'));
        // ctx.session.message_id = ctx.message.message_id;
        let i = 0;
        let stop = setInterval(() => {
            // console.log(users_id[i]["chat_id"]);
            // bot.telegram.editMessageText(ctx.message.from.id, ctx.session.message_id, ctx.i18n.t('accept_message') + (i + 1));
            // console.log(key);
            if (i < users_id.length) {
                if (users_id[i]["chat_id"]) {
                    ctx.telegram
                        .sendMessage(users_id[i]["chat_id"], ctx.session.message_text)
                        .then((Response) => {
                            // console.log("userga yuborildi!");
                        })
                        .catch((err) => {
                            console.log("blocklangan user!");
                        });
                }
                i++;
            } else {
                clearInterval(stop);
                console.log("Userlarga jo'natilish yakunlandi...");
                ctx.session.message_id = undefined;
            }
        }, 50);
        await main_buttons(ctx)
    } catch (err) {
        console.log("Barchaga chat yuborishda xatolik: " + err);
    }
}
// arxive datani chiqarish...
const show_data_board = async (ctx, data) => {
    try {
        // console.log(data);
        if (data != undefined) {
            return ctx.i18n.t("show_user_board")
                .replace('{n1}', data["name_date"])
                .replace('{n2}', data["Сотрудники"] == null ? "❌" :
                    data["Сотрудники"])
                .replace('{n3}', data["Кол_во_выходов"] == null ? "❌" :
                    data["Кол_во_выходов"].length > 3 && data["Кол_во_выходов"].length <= 6 ? data["Кол_во_выходов"].insert(-3, " ") : data["Кол_во_выходов"].insert(-3, " ").insert(-7, " "))
                .replace('{n4}', data["Кол_во_отраб"] == null ? "❌" :
                    data["Кол_во_отраб"].length > 3 && data["Кол_во_отраб"].length <= 6 ? data["Кол_во_отраб"].insert(-3, " ") : data["Кол_во_отраб"].insert(-3, " ").insert(-7, " "))
                .replace('{n5}', data["Кол_во_Дежурства_день"] == null ? "❌" :
                    data["Кол_во_Дежурства_день"].length > 3 && data["Кол_во_Дежурства_день"].length <= 6 ? data["Кол_во_Дежурства_день"].insert(-3, " ") : data["Кол_во_Дежурства_день"].insert(-3, " ").insert(-7, " "))
                .replace('{n6}', data["Кол_о_Дежурства_ночь"] == null ? "❌" :
                    data["Кол_о_Дежурства_ночь"].length > 3 && data["Кол_о_Дежурства_ночь"].length <= 6 ? data["Кол_о_Дежурства_ночь"].insert(-3, " ") : data["Кол_о_Дежурства_ночь"].insert(-3, " ").insert(-7, " "))
                .replace('{n7}', data["Окклад"] == null ? "❌" :
                    data["Окклад"].length > 3 && data["Окклад"].length <= 6 ? data["Окклад"].insert(-3, " ") : data["Окклад"].insert(-3, " ").insert(-7, " "))
                .replace('{n8}', data["За_вредность"] == null ? "❌" :
                    data["За_вредность"].length > 3 && data["За_вредность"].length <= 6 ? data["За_вредность"].insert(-3, " ") : data["За_вредность"].insert(-3, " ").insert(-7, " "))
                .replace('{n9}', data["Дежурства_день"] == null ? "❌" :
                    data["Дежурства_день"].length > 3 && data["Дежурства_день"].length <= 6 ? data["Дежурства_день"].insert(-3, " ") : data["Дежурства_день"].insert(-3, " ").insert(-7, " "))
                .replace('{n10}', data["Дежурства_ночь"] == null ? "❌" :
                    data["Дежурства_ночь"].length > 3 && data["Дежурства_ночь"].length <= 6 ? data["Дежурства_ночь"].insert(-3, " ") : data["Дежурства_ночь"].insert(-3, " ").insert(-7, " "))
                .replace('{n11}', data["Отпускные"] == null ? "❌" :
                    data["Отпускные"].length > 3 && data["Отпускные"].length <= 6 ? data["Отпускные"].insert(-3, " ") : data["Отпускные"].insert(-3, " ").insert(-7, " "))
                .replace('{n12}', data["Доплата"] == null ? "❌" :
                    data["Доплата"].length > 3 && data["Доплата"].length <= 6 ? data["Доплата"].insert(-3, " ") : data["Доплата"].insert(-3, " ").insert(-7, " "))
                .replace('{n13}', data["Премия"] == null ? "❌" :
                    data["Премия"].length > 3 && data["Премия"].length <= 6 ? data["Премия"].insert(-3, " ") : data["Премия"].insert(-3, " ").insert(-7, " "))
                .replace('{n14}', data["Всего_ачислено"] == null ? "❌" :
                    data["Всего_ачислено"].length > 3 && data["Всего_ачислено"].length <= 6 ? data["Всего_ачислено"].insert(-3, " ") : data["Всего_ачислено"].insert(-3, " ").insert(-7, " "))
                .replace('{n15}', data["Подоходный_налог"] == null ? "❌" :
                    data["Подоходный_налог"].length > 3 && data["Подоходный_налог"].length <= 6 ? data["Подоходный_налог"].insert(-3, " ") : data["Подоходный_налог"].insert(-3, " ").insert(-7, " "))
                .replace('{n16}', data["Займ"] == null ? "❌" :
                    data["Займ"].length > 3 && data["Займ"].length <= 6 ? data["Займ"].insert(-3, " ") : data["Займ"].insert(-3, " ").insert(-7, " "))
                .replace('{n17}', data["Всего_удержано"] == null ? "❌" :
                    data["Всего_удержано"].length > 3 && data["Всего_удержано"].length <= 6 ? data["Всего_удержано"].insert(-3, " ") : data["Всего_удержано"].insert(-3, " ").insert(-7, " "))
                .replace('{n18}', data["Аванс"] == null ? "❌" :
                    data["Аванс"].length > 3 && data["Аванс"].length <= 6 ? data["Аванс"].insert(-3, " ") : data["Аванс"].insert(-3, " ").insert(-7, " "))
                .replace('{n19}', data["К_выдаче"] == null ? "❌" :
                    data["К_выдаче"].length > 3 && data["К_выдаче"].length <= 6 ? data["К_выдаче"].insert(-3, " ") : data["К_выдаче"].insert(-3, " ").insert(-7, " "))
                .replace('{n20}', data["creation_date"].toString())
        } else {
            return "Sizda arxivi malumotlar mavjud emas!";
        }
    } catch (err) {
        console.log("arxivni datasini to'g'irlab chiqarishda xatolik: " + err);
    }
}
// oylik xisobotni userga chiqarib berish uchun...ctx.message.from.id
const show_data = async (ctx) => {
    try {
        // console.log(ctx.message.from.id)
        let data = await need_data(ctx.message.from.id);
        // console.log(data);
        if (data.length == 1) {
            ctx.replyWithHTML(ctx.i18n.t("show_user")
                .replace('{n1}', data[0]["name_date"])
                .replace('{n2}', data[0]["Сотрудники"] == null ? "❌" :
                    data[0]["Сотрудники"])
                .replace('{n3}', data[0]["Кол_во_выходов"] == null ? "❌" :
                    data[0]["Кол_во_выходов"].length > 3 && data[0]["Кол_во_выходов"].length <= 6 ? data[0]["Кол_во_выходов"].insert(-3, " ") : data[0]["Кол_во_выходов"].insert(-3, " ").insert(-7, " "))
                .replace('{n4}', data[0]["Кол_во_отраб"] == null ? "❌" :
                    data[0]["Кол_во_отраб"].length > 3 && data[0]["Кол_во_отраб"].length <= 6 ? data[0]["Кол_во_отраб"].insert(-3, " ") : data[0]["Кол_во_отраб"].insert(-3, " ").insert(-7, " "))
                .replace('{n5}', data[0]["Кол_во_Дежурства_день"] == null ? "❌" :
                    data[0]["Кол_во_Дежурства_день"].length > 3 && data[0]["Кол_во_Дежурства_день"].length <= 6 ? data[0]["Кол_во_Дежурства_день"].insert(-3, " ") : data[0]["Кол_во_Дежурства_день"].insert(-3, " ").insert(-7, " "))
                .replace('{n6}', data[0]["Кол_о_Дежурства_ночь"] == null ? "❌" :
                    data[0]["Кол_о_Дежурства_ночь"].length > 3 && data[0]["Кол_о_Дежурства_ночь"].length <= 6 ? data[0]["Кол_о_Дежурства_ночь"].insert(-3, " ") : data[0]["Кол_о_Дежурства_ночь"].insert(-3, " ").insert(-7, " "))
                .replace('{n7}', data[0]["Оклад"] == null ? "❌" :
                    data[0]["Оклад"].length > 3 && data[0]["Оклад"].length <= 6 ? data[0]["Оклад"].insert(-3, " ") : data[0]["Оклад"].insert(-3, " ").insert(-7, " "))
                .replace('{n8}', data[0]["За_вредность"] == null ? "❌" :
                    data[0]["За_вредность"].length > 3 && data[0]["За_вредность"].length <= 6 ? data[0]["За_вредность"].insert(-3, " ") : data[0]["За_вредность"].insert(-3, " ").insert(-7, " "))
                .replace('{n9}', data[0]["Дежурства_день"] == null ? "❌" :
                    data[0]["Дежурства_день"].length > 3 && data[0]["Дежурства_день"].length <= 6 ? data[0]["Дежурства_день"].insert(-3, " ") : data[0]["Дежурства_день"].insert(-3, " ").insert(-7, " "))
                .replace('{n10}', data[0]["Дежурства_ночь"] == null ? "❌" :
                    data[0]["Дежурства_ночь"].length > 3 && data[0]["Дежурства_ночь"].length <= 6 ? data[0]["Дежурства_ночь"].insert(-3, " ") : data[0]["Дежурства_ночь"].insert(-3, " ").insert(-7, " "))
                .replace('{n11}', data[0]["Отпускные"] == null ? "❌" :
                    data[0]["Отпускные"].length > 3 && data[0]["Отпускные"].length <= 6 ? data[0]["Отпускные"].insert(-3, " ") : data[0]["Отпускные"].insert(-3, " ").insert(-7, " "))
                .replace('{n12}', data[0]["Доплата"] == null ? "❌" :
                    data[0]["Доплата"].length > 3 && data[0]["Доплата"].length <= 6 ? data[0]["Доплата"].insert(-3, " ") : data[0]["Доплата"].insert(-3, " ").insert(-7, " "))
                .replace('{n13}', data[0]["Премия"] == null ? "❌" :
                    data[0]["Премия"].length > 3 && data[0]["Премия"].length <= 6 ? data[0]["Премия"].insert(-3, " ") : data[0]["Премия"].insert(-3, " ").insert(-7, " "))
                .replace('{n14}', data[0]["Всего_ачислено"] == null ? "❌" :
                    data[0]["Всего_ачислено"].length > 3 && data[0]["Всего_ачислено"].length <= 6 ? data[0]["Всего_ачислено"].insert(-3, " ") : data[0]["Всего_ачислено"].insert(-3, " ").insert(-7, " "))
                .replace('{n15}', data[0]["Подоходный_налог"] == null ? "❌" :
                    data[0]["Подоходный_налог"].length > 3 && data[0]["Подоходный_налог"].length <= 6 ? data[0]["Подоходный_налог"].insert(-3, " ") : data[0]["Подоходный_налог"].insert(-3, " ").insert(-7, " "))
                .replace('{n16}', data[0]["Займ"] == null ? "❌" :
                    data[0]["Займ"].length > 3 && data[0]["Займ"].length <= 6 ? data[0]["Займ"].insert(-3, " ") : data[0]["Займ"].insert(-3, " ").insert(-7, " "))
                .replace('{n17}', data[0]["Всего_удержано"] == null ? "❌" :
                    data[0]["Всего_удержано"].length > 3 && data[0]["Всего_удержано"].length <= 6 ? data[0]["Всего_удержано"].insert(-3, " ") : data[0]["Всего_удержано"].insert(-3, " ").insert(-7, " "))
                .replace('{n18}', data[0]["Аванс"] == null ? "❌" :
                    data[0]["Аванс"].length > 3 && data[0]["Аванс"].length <= 6 ? data[0]["Аванс"].insert(-3, " ") : data[0]["Аванс"].insert(-3, " ").insert(-7, " "))
                .replace('{n19}', data[0]["К_выдаче"] == null ? "❌" :
                    data[0]["К_выдаче"].length > 3 && data[0]["К_выдаче"].length <= 6 ? data[0]["К_выдаче"].insert(-3, " ") : data[0]["К_выдаче"].insert(-3, " ").insert(-7, " "))
                .replace('{n20}', data[0]["creation_date"].toString())
            );
        } else {
            await start_fun(ctx);
            await ctx.reply(
                ctx.i18n.t('load'),
                {
                    parse_mode: "markdown",
                    reply_markup: { remove_keyboard: true },
                }
            );

            ctx.session.checkUser = false;
        }
    } catch (err) {
        console.log("So'ngi oylik xisobotni chiqarishda xatolik :" + err);
    }
}
// numberni tekshirish...
const isItNumber = async (params) => {
    // nomer kelganda orqa oldida yoki o'rtasida "-" yoki " " joylarni tozlash.
    const x = params.trim().replace(/ /g, "");
    if (/^\+998\d/.test(x)) {
        return x.substring(1);
    } else {
        return x;
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
    show_data_board,
    // admin panel ...
    main_buttons,
    send_excel,
    down_excel,
    read_excel,
    show_data,
    show_archive,
    send_post,
    send_message,
    // check phone number
    isItNumber
}