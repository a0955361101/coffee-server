const db = require(__dirname + '/../modules/mysql-connect');

(async () => {
    const [resultes, fields] = await db.query("SELECT * FROM course");

    console.log(resultes);
    process.exit(); // 結束行程
})();