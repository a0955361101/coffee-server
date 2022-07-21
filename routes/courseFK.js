// 後端分頁功能
const express = require('express');
const db = require(__dirname + '/../modules/mysql-connect');

const router = express.Router();

router.get('/', async (req, res) => {
    const sql03 = "SELECT * FROM`course` JOIN course_related ON `course`.`course_sid` = `course_related`.`course_sid`";
    const [r3] = await db.query(sql03);

    res.json(r3);
});

module.exports = router;