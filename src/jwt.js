require("dotenv").config();

const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 12, account: 'shin' }, process.env.JWT_SECRET);

console.log(token);


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImFjY291bnQiOiJzaGluIiwiaWF0IjoxNjU4MzAyMDk4fQ.WXk-rNMhe4usxz3ufuOlP1q2jUNwgOmlWVVg8Bmer8A