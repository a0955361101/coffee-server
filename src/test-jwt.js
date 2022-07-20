require('dotenv').config();

const jwt = require('jsonwebtoken');


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImFjY291bnQiOiJzaGluIiwiaWF0IjoxNjU4MzAyMDk4fQ.WXk-rNMhe4usxz3ufuOlP1q2jUNwgOmlWVVg8Bmer8A';


jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
        console.log({ error });
    }
    console.log(decoded);
    process.exit();
});
