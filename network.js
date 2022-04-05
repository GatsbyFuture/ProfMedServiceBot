const https = require('https');
const fs = require('fs');

const url = "https://images.pexels.com/photos/913215/pexels-photo-913215.jpeg";

https.get(url, (res) => {
    const fileStream = fs.createWriteStream('Mountian.jpeg');
    res.pipe(fileStream);
    fileStream.on('finish', () => {
        fileStream.close();
        console.log("Yuklandi!");
    });
});