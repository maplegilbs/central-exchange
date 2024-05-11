//Libraries
const mysql = require('mysql2');
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const pool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_ADMIN_USER,
        password: process.env.DB_ADMIN_PASSWORD,
        database: process.env.DB_NAME_BEARCOBBLE
    }
).promise()

const getSomeData = async (pastTime) => {
    const queryResult = await pool.query(
        `
        select *
        from vacuumlogs
        order by recordDateTime desc
        limit 10
        `
    )
    return queryResult[0]
}

const queryResults = await getSomeData(24);
console.log(queryResults)