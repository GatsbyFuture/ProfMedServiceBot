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

readXlsx('E:/ProfMedServiceBot/archive/Таблица.xlsx');

