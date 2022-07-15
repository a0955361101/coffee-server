require('dotenv').config();
const express = require("express");
const multer = require('multer');
const session = require('express-session');
const upload = require(__dirname + '/modules/upload-images');
const db = require(__dirname + '/modules/mysql-connect');
const MysqlStore = require('express-mysql-session')(session);
const sessionStore = new MysqlStore({}, db);
const app = express();


app.use('/coffee', require(__dirname + '/routes/coffee'));


app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'daf121f2df31dg1g123sg132s1fdsfg3213sg1',
    store: sessionStore,
    cookie: {
        maxAge: 1800000, // 30min
    }
}));



app.get('/try-session', (req, res) => {
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;
    res.json({
        my_var: req.session.my_var,
        session: req.session,
    });
});


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

