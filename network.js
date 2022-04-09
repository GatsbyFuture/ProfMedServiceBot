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

const readXlsx = (data) => {
    try {
        const workbook = XLSX.readFile(data);
        const workbookSheets = workbook.SheetNames;
        console.log(workbookSheets);
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
        console.log(dataExcel);
        // console.log(data);
    } catch (err) {
        console.log('xatolik' + err);
    }
}

// readXlsx('E:/ProfMedServiceBot/archive/dataPractical.xlsx');
