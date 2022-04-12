// bu faylda faqat crud ammallari bajariladi...
const { pool } = require('../db/connect_db');
// bazadan userni nomeri bo'yicha tekshirish va bor bo'lsa unga chat_id beradi...
const check_number = async (id, number) => {
    try {
        let question = `select тел_номер from main_tb where тел_номер = ?`;
        let update_data = `UPDATE main_tb SET chat_id = ? WHERE тел_номер = ?`;
        let answer = await pool.query(question, [number]);
        // console.log(answer);
        // console.log(answer[0][0]["тел_номер"]);
        if (answer[0].length == 1) {
            await pool.query(update_data, [id, number])
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log("Tel nomerni tekshirishda xatolik ->" + err);
    }
}
const check_user = async (id) => {
    try {
        let question = `select chat_id from main_tb where chat_id = ?`;
        let answer = await pool.query(question, [id]);
        // console.log(answer)
        if (answer[0].length == 1)
            return true;
        else
            return false;
    } catch (err) {
        console.log("Userni mavjudligini tekshirishda xatolik ->" + err);
    }
}
const need_data = async (id) => {
    try {
        let question = `select
        name_date,
        Сотрудники,
        Кол_во_выходов,
        Кол_во_отраб,
        Кол_во_Дежурства_день,
        Кол_о_Дежурства_ночь,
        Оклад,
        За_вредность,
        Дежурства_день,
        Дежурства_ночь,
        Отпускные,
        Доплата,
        Премия,
        Всего_ачислено,
        Подоходный_налог,
        Займ,
        Всего_удержано,
        creation_date
        from
        main_tb
        where status = 1 and chat_id = ?`;
        let answer = await pool.query(question, [id]);
        return answer[0];
    } catch (err) {
        console.log("Dateni tortishda xatolik :" + err);
    }
}

module.exports = {
    check_number,
    check_user,
    need_data
}