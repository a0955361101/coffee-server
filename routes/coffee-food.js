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
    const sql03 = "SELECT * FROM menu";
    // 外鍵SQL
    // const sql03 = "SELECT * FROM`course` JOIN course_related ON `course`.`course_sid` = `course_related`.`course_sid`";
    const [r3] = await db.query(sql03);
    output = { ...output, page, totalRows, totalPages };
    // res.json(output);

    // const sql = "INSERT INTO `course`(`course_name`, `course_price`, `course_level`, `course_img_s`, `course_content`, `course_people`, `course_material`) VALUES (?,?,?,?,?,?,?)";
    // const { course_name, course_price, course_level, course_img_s, course_content, course_people, course_material } = req.body;
    // const [result] = await db.query(sql, [course_name, course_price, course_level, course_img_s, course_content, course_people, course_material]);
    // res.json(result);

    res.json(r3);
});

module.exports = router;



// SELECT * FROM`主表單`
// JOIN 要連結的表單
// ON `主表單`.`主表的外鍵欄位` = `要連結的表單`.`要連結的表單的PK`
// 外鍵SQL
// SELECT * FROM`course` JOIN course_related ON `course`.`course_sid` = `course_related`.`course_sid`; 