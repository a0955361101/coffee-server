// 後端分頁功能
const express = require('express');
const db = require(__dirname + '/../modules/mysql-connect');

const router = express.Router();

router.get('/', async (req, res) => {
    let output = {
        perPage: 6,
        page: 1,
        totalRows: 0,
        totalPages: 0,
        rows: [],
    };
    let page = +req.query.page || 1;
    if (page < 1) {
        return res.redirect('?page=1');
    }

    const sql01 = "SELECT COUNT(1) totalRows FROM course";
    const [[{ totalRows }]] = await db.query(sql01);
    let totalPages = 0;
    if (totalRows) {
        totalPages = Math.ceil(totalRows / output.perPage);
        if (page > totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }
        const sql02 = `SELECT * FROM course LIMIT ${(page - 1) * output.perPage},${output.perPage}`;
        const [r2] = await db.query(sql02);
        output.rows = r2;
    }
    const sql03 = "SELECT * FROM course";
    const [r3] = await db.query(sql03);
    output = { ...output, page, totalRows, totalPages };
    // res.json(output);

    res.json(r3);
});

module.exports = router;