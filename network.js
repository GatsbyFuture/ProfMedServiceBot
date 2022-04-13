// const https = require('https');
// const fs = require('fs');

// const url = "https://images.pexels.com/photos/913215/pexels-photo-913215.jpeg";

// https.get(url, (res) => {
//     const fileStream = fs.createWriteStream('Mountian.jpeg');
//     res.pipe(fileStream);
//     fileStream.on('finish', () => {
//         fileStream.close();
//         console.log("Yuklandi!");
//     });
// });

// *************
const XLSX = require('xlsx');
const { pool } = require('./db/connect_db');
const read_data = async () => {
    let result = await pool.query(
        'select id from date_tb where date_month = ?', ['Расчет зарплаты за 31 марта 2022 г.']
    );
    console.log(result);
}
// read_data();
// 123456789987456321
// date tableni yaratish....
const date_read = async (data_name) => {
    console.log(data_name);
    await pool.query(
        `insert into date_tb (
            id,
            date_month
        ) values (
            null,
            ?
        )`,
        [data["__EMPTY_1"]]
    )
    return await pool.query(
        'select id from date_tb where date_month = ?', [data_name]
    );
}

const readXlsx = async (data) => {
    try {
        const workbook = XLSX.readFile(data);
        const workbookSheets = workbook.SheetNames;
        // console.log(workbookSheets);
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        // console.log(typeof dataExcel[3]["__EMPTY_4"].toString());
        // console.log(data);
        const result = await date_read(dataExcel[0]["__EMPTY_1"]);
    } catch (err) {
        console.log('xatolik' + err);
    }
}

// readXlsx('E:/ProfMedServiceBot/archive/Таблица.xlsx');
// tel nomerni tekshirish uchun code...
const check_number = async (number) => {
    try {
        let question = `select тел_номер from main_tb where тел_номер = ?`;
        let answer = await pool.query(question, [number]);
        // console.log(answer);
        if (answer[0].length == 1)
            return true;
        else
            return false;
    } catch (err) {
        console.log(err);
    }
}
// pull date...
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
// arxivi datalarni tortish...
const archive_data = async () => {
    try {
        let max_text = `select 
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
        where chat_id = 1563800631 limit ?,3;`
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
// (async function xyz() {
//     const result = await archive_data();
//     console.log(result[0]);
// }());
// katologda file bormi? yoqmi tekshiramiz...
// fs.readdir('./archive/', (err, files) => {
//     if (err)
//         console.log("File yoq!");
//     else
//         console.log("File mavjud: " + files);

// });
// const { promises: fs } = require('fs');
// const dir = './archive/';

// const getNumFiles = async (dir) => {
//   const files = await fs.readdir(dir)
//   console.log(files.length)
// }
// getNumFiles(dir)
const fs = require('fs');
const dir = './archive/';

fs.readdir(dir, (err, files, ctx) => {
    console.log(typeof files.length);
});