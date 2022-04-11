const { Composer } = require('telegraf');
const { bot } = require('../core/run');
const composer = new Composer();
const { start_fun, mainThree, sendContact,
    main_buttons,
    send_excel,
    down_excel,
    read_excel } = require('../controller/function.js');
const config = require('config');

composer.on('message', async (ctx) => {
    try {
        let phoneNumber = undefined;
        if (ctx.message.contact) {
            phoneNumber = ctx.message.contact.phone_number;
            ctx.replyWithHTML('Nomeringiz tekshirilmoqda...' + phoneNumber)
            await sendContact(ctx, phoneNumber);
        } else if (ctx.i18n.t('sendConConsole') == ctx.message.text) {
            ctx.deleteMessage(ctx.session.consoleCon.message_id);
            ctx.deleteMessage();
            ctx.session.consoleCon = undefined;
            await start_fun(ctx);
        }
        // asosiy menular bilna ishlash...
        switch (ctx.message.text) {
            case ctx.i18n.t('mainFuntion0'): ctx.reply('1'); break;
            case ctx.i18n.t('mainFuntion1'): ctx.reply('2'); break;
            case ctx.i18n.t('mainFuntion2'): await mainThree(ctx); break;
            // admin uchun kirish...
            case config.get('password_admin'):
                await main_buttons(ctx);
                ctx.session.admin = true; break;
            case "exit@0020912": ctx.session.admin = false; break;
            case "🗂  Excel file jo'natish": await send_excel(ctx); break;
            case "📨 File taqdim etish": await read_excel(ctx); break;
            case "📤 Xabar jo'natish": ctx.reply('14'); break;
            // case "🔍 Qidirish": ctx.reply('13');
            default: break;
        }
        // fileni yuklab olish uchun...
        if (ctx.session.rideFile) {
            // console.log(ctx.update.message.document);
            if (ctx.update.message.document) {
                ctx.session.file_name = await down_excel(ctx);
                await main_buttons(ctx);
                ctx.session.rideFile = false;
            } else {
                ctx.replyWithHTML("<b>❗️ File formati xato!</b> <i>Namuna: 'xlsx'</i>");
                await main_buttons(ctx);
                ctx.session.rideFile = false;
            }
        }
    } catch (err) {
        console.log(err);
    }
});
// Admin panel uchun parolni ilib olish...
bot.use(composer.middleware())