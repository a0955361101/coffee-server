require('dotenv').config();
const express = require("express");
const multer = require('multer');
const session = require('express-session');
const upload = require(__dirname + '/modules/upload-images');
const db = require(__dirname + '/modules/mysql-connect');
const MysqlStore = require('express-mysql-session')(session);
const sessionStore = new MysqlStore({}, db);
const app = express();
const cors = require('cors');
const axios = require('axios');
const sampleData = require('./src/sampleData');
const uuid = require('uuid');
const { LINEPAY_CHANNEL_ID, LINEPAY_CHANNEL_SECRET_KEY, LINEPAY_VERSION, LINEPAY_SITE, LINEPAY_RETURN_HOST, LINEPAY_RETURN_CONFIRM_URL, LINEPAY_RETURN_CANCEL_URL } = process.env;
const orders = {};
//把照片引入前端
const path = require('path');
const { HmacSHA256 } = require('crypto-js');
const dir = path.join(__dirname, 'public');
const Base64 = require('crypto-js/enc-base64');



app.use(cors());
app.use(express.static(dir));
app.use('/coffee-course-get', require(__dirname + '/routes/coffee'));
app.use('/coffee-food-get', require(__dirname + '/routes/coffee-food'));
app.use('/coffee-courseFK-get', require(__dirname + '/routes/courseFK'));
app.get('/checkout/:id', (req, res) => {
    const { id } = req.params;
    const order = sampleData[id];
    order.orderId = uuid.v4();
    orders[order.orderId] = order;
    // res.send(`
    //         <div>價格: ${order.amount}</div>
    //         <div>產品ID: ${order.packages[0].id}</div>              
    //         <div>ID: ${order.orderId}</div>   
    //         <form action="/createOrder/${order.orderId}" method="post">
    //         <button type="submit">送出</button>  
    //         </form>                         
    // ` );
    res.send(console.log(order));
});
// 跟LINE PAY 串接的 API
app.post('/createOrder/:orderId', async (req, res) => {
    const { orderId } = req.params;

    const order = JSON.parse(orderId);
    // const order = orders[orderId];

    console.log(order);

    try {
        const linePayBody = {
            ...order,
            redirectUrls: {
                confirmUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CONFIRM_URL}`,
                cancelUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CANCEL_URL}`,
            }
        };
        // console.log(linePayBody);
        const uri = "/payments/request";
        const headers = createSignature(uri, linePayBody);

        //準備送給LINE Pay的資訊
        const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;

        const linePayRes = await axios.post(url, linePayBody, { headers });
        // console.log(linePayRes.data);
        if (linePayRes?.data?.returnCode === '0000') {
            res.send(`${linePayRes.data.info.paymentUrl.web}`);
        }
    } catch (error) {
        console.log(error);
        res.end();
    }

    function createSignature(uri, linePayBody) {
        const nonce = uuid.v4();
        const string = `${LINEPAY_CHANNEL_SECRET_KEY}/${LINEPAY_VERSION}${uri}${JSON.stringify(linePayBody)}${nonce}`;
        const signatrue = Base64.stringify(HmacSHA256(string, LINEPAY_CHANNEL_SECRET_KEY));
        const headers = {
            'X-LINE-ChannelId': LINEPAY_CHANNEL_ID,
            'Content-Type': 'application/json',
            'X-LINE-Authorization-Nonce': nonce,
            'X-LINE-Authorization': signatrue,
        };
        return headers;
    }
});

app.get('/linePay/comfirm', async (req, res) => {
    console.log(req);
    try {
        const { transactionId, orderId } = req.query;
        console.log(transactionId, orderId);
        const order = orders[orderId];
        const linePayBody = {
            amount: order.amount,
            currency: 'TWD',
        };
        const uri = `payments/${transactionId}/confirm`;
        const headers = createSignature(uri, linePayBody);
        const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
        const linePayRes = await axios.post(url, linePayBody, { headers });
        res.send(console.log(linePayRes));
    } catch (error) {
        res.end();
    }


});



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
    res.send(`< h2 > 安安</> `);
});





// use 接收所有的方法
app.use((req, res) => {
    res.send(`< h2 > 找不到頁面 404</ > `);
});

app.listen(process.env.PORT, () => {
    console.log(`server started:${process.env.PORT}`);
});
