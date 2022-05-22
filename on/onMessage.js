const { Composer } = require('telegraf');
const { bot } = require('../core/run');
const composer = new Composer();
const { start_fun, mainThree, sendContact,
    main_buttons,
    allBaseBtn,
    send_excel,
    down_excel,
    read_excel,
    show_data,
    show_archive,
    send_post,
    send_message,
    isItNumber
} = require('../controller/function.js');
const config = require('config');

composer.on('message', async (ctx) => {
    try {
        let phoneNumber = undefined;
        if (ctx.message.contact) {
            phoneNumber = await isItNumber(ctx.message.contact.phone_number);
            // console.log(phoneNumber);
            ctx.replyWithHTML('Nomeringiz tekshirilmoqda...' + phoneNumber);
            await sendContact(ctx, phoneNumber);
        } else if (ctx.i18n.t('sendConConsole') == ctx.message.text) {
            await ctx.reply(
                ctx.i18n.t('load'),
                {
                    parse_mode: "markdown",
                    reply_markup: { remove_keyboard: true },
                }
            );
            await start_fun(ctx);
        }
        // asosiy menular bilna ishlash...
        switch (ctx.message.text) {
            // user uchun controll...
            case ctx.i18n.t('mainFuntion0'): await show_data(ctx); break;
            case ctx.i18n.t('mainFuntion1'): await show_archive(ctx); break;
            case ctx.i18n.t('mainFuntion2'): await mainThree(ctx); break;
            // admin uchun kirish...
            case config.get('password_admin'):
                await main_buttons(ctx);
                ctx.session.admin = true; break;
            case "exit@0020912":
                ctx.session.admin = false;
                await allBaseBtn(ctx);
                break;
            case ctx.i18n.t('send_file_btn'): await send_excel(ctx); break;
            case ctx.i18n.t('read_file_btn'): await read_excel(ctx); break;
            case ctx.i18n.t('send_message_btn'):
                ctx.reply(
                    ctx.i18n.t('post_report'),
                    {
                        parse_mode: "markdown",
                        reply_markup: { remove_keyboard: true },
                    }
                );
                setTimeout(() => {
                    ctx.session.send_m = true;
                }, 100);
                break;
            case ctx.i18n.t('send_post'): await send_message(ctx); break;
            case ctx.i18n.t('post_cancel'):
                ctx.replyWithHTML(ctx.i18n.t('message_cancel'));
                await main_buttons(ctx);
                ctx.session.message_text = undefined;
                await ctx.reply(
                    ctx.i18n.t('load'),
                    {
                        parse_mode: "markdown",
                        reply_markup: { remove_keyboard: true },
                    }
                );

                break;
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
                ctx.replyWithHTML(ctx.i18n.t('message_cancel'));
                await main_buttons(ctx);
                ctx.session.rideFile = false;
            }
        }
        if (ctx.session.send_m) {
            ctx.session.message_text = ctx.message.text;
            console.log(ctx.message.text);
            await send_post(ctx);
        }
    } catch (err) {
        console.log(err);
    }
});

// Admin panel uchun parolni ilib olish...
bot.use(composer.middleware())