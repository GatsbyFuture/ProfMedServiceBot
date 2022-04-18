// automat message yuboradi userlarga ...
// third function ...
const axios = require('axios').default;
const { pool } = require('./db/connect_db');

const format = async (data, date) => {
    // userga atalgan message ...
    let text_message = `Assalomu alaykum {name},
        sizni bugungi tug'ulgan kuniz bilan chin dildan tabriklayman!`;
    // bugunki kunni va oyni tekshirib olamiz...
    let day = parseInt(data["date_birth"].substring(0, 2));
    let month = parseInt(data["date_birth"].substring(3, 5));
    // ism familalarni qo'yish joyi...
    text_message = text_message.replace('{name}', data["name"]);
    // bazadagi userlar date lari bilan bugungi kunni tekshirib ko'ramiz..
    if (day == date.getDate() && month == (date.getMonth() + 1)) {
        // console.log("Tug'ulgan kuniz muborak bo'lsin!" + day + " : " + month);
        await axios
            .get('https://api.telegram.org/bot1918886076:AAGkIpT42ip8eD1zV9Ec5k4smSGF9ulpx8s/sendMessage', {
                params: {
                    chat_id: data["telegramid"],
                    text: text_message
                }
            })
            .then((result) => {
                console.log(result["statusText"]);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
// Second function ...
const data_user = async () => {
    try {
        // bazadan userlarni datasini olib kelish...
        let question = `select date_birth,name,telegramid from tb_clients`;
        let data = await pool.query(question);
        return data[0];
    } catch (err) {
        console.log("data userni chiqarishda xatolik :" + err);
    }
}
// firt function ...
const check = async () => {
    // console.log("Tug'ulgan kuniz muborak bo'lsin!");
    const date = new Date();
    const result = await data_user();
    // console.log(result);
    for (let i = 0; i < result.length; i++) {
        await format(result[i], date);
    }
}
(async function () {
    await check();
}());