// bu faylda faqat crud ammallari bajariladi...
const { pool } = require('../db/connect_db');
// bazadan userni nomeri bo'yicha tekshirish va bor bo'lsa unga chat_id beradi...
const sleep_status = async () => {
    let date_query = `UPDATE date_tb SET status=0`;
    let main_query = `UPDATE main_tb SET status=0`;
    let foot_query = `UPDATE foot_tb SET status=0`;
    await pool.query(date_query);
    await pool.query(main_query);
    await pool.query(foot_query);
    console.log("Datalarni statusini 0 ga tushurish...");
}
const check_number = async (id, number) => {
    try {
        let question = `select тел_номер from main_tb where тел_номер = ? and status = 1`;
        let update_data = `UPDATE main_tb SET chat_id = ? WHERE тел_номер = ? and status = 1`;
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
        let question = `select chat_id from main_tb where chat_id = ? and status = 1`;
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
// joriy oylik xisoboti...
const archive_data = async () => {
    try {
        let max_text = `select date_month from date_tb limit ?,3`
        let amount_text = `select count(id) as amount from date_tb`;
        let min_text = `select date_month from date_tb`;
        let amount = await pool.query(amount_text);
        if (amount[0][0].amount < 3) {
            return await pool.query(min_text);
        } else {
            return await pool.query(max_text, [amount[0][0].amount - 4]);
        }
    } catch (err) {
        console.log("arxivni tortishda xatolik: " + err);
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
    need_data,
    sleep_status,
    archive_data
}