require('dotenv').config();
const express = require("express");
const multer = require('multer');
const upload = require(__dirname + '/modules/upload-images');

const app = express();


// 測試用
app.get('/try-qs', (req, res) => {
    res.json(req.query);
});
// middleware: 中介軟體(function)
const bodyParser = express.urlencoded({ extended: false });
app.post('/try-post', bodyParser, (req, res) => {
    res.json(req.body);
});

//上傳照片
app.post('/try-upload', upload.single('avatar'), (req, res) => {
    res.json(req.file);
});
//上傳多個檔案
app.post('/try-uploads', upload.array('photos'), (req, res) => {
    res.json(req.files);
});


app.get('/', (req, res) => {
    res.send(`<h2>安安</h2>`);
});




// use 接收所有的方法
app.use((req, res) => {
    res.send(`<h2>找不到頁面 404</h2>`);
});

app.listen(process.env.PORT, () => {
    console.log(`server started:${process.env.PORT}`);
});

