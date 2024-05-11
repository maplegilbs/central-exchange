//Libraries
const mysql = require('mysql2');
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//Functions
import { getSensorData } from './getSensorData.js';
import { calcVolFromHeight } from './tankVolFromHeight.js'
import { adjustForUTC } from './adjForUTCDate.js';

//Connect to database
const pool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_ADMIN_USER,
        password: process.env.DB_ADMIN_PASSWORD,
        database: process.env.DB_NAME_BEARCOBBLE
    }
).promise()

//Get sensor data, if the fetch is successful, insert the data into the databases for vacuumlogs and tanklogs
async function insertData(){
    try {
        const sensorData = await getSensorData();
        if(sensorData){
            const insertedVacData = await pool.query(
                `
                insert into vacuumlogs
                (
                    recordDateTime, 
                    vac1, vac1Time, 
                    vac2, vac2Time, 
                    vac3, vac3Time,
                    vac4, vac4Time,
                    vac5, vac5Time,
                    barometer
                )
                values 
                (
                    ?,
                    ?, ?,
                    ?, ?,
                    ?, ?,
                    ?, ?,
                    ?, ?,
                    ?
                )
                `,
                [
                    adjustForUTC(new Date()),
                    sensorData[0].section1.vacuum_reading, adjustForUTC(new Date(sensorData[0].section1.reading_time)),
                    sensorData[0].section2.vacuum_reading, adjustForUTC(new Date(sensorData[0].section2.reading_time)),
                    sensorData[0].section3.vacuum_reading, adjustForUTC(new Date(sensorData[0].section3.reading_time)),
                    sensorData[0].section4.vacuum_reading, adjustForUTC(new Date(sensorData[0].section4.reading_time)),
                    sensorData[0].section5.vacuum_reading, adjustForUTC(new Date(sensorData[0].section5.reading_time)),
                    sensorData[2]
                ]
            )
            const insertedTankData = await pool.query(
                `
                insert into tanksnapshots
                (
                    recordDateTime, 
                    tank1Height, tank1Vol, tank1Time, 
                    tank2Height, tank2Vol, tank2Time, 
                    tank3Height, tank3Vol, tank3Time,
                    tank4Height, tank4Vol, tank4Time,
                    tank5Height, tank5Vol, tank5Time
                )
                values 
                (
                    ?,
                    ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?
                )
                `,
                [
                    adjustForUTC(new Date()),
                    sensorData[1].tank1.tank_level, calcVolFromHeight(sensorData[1].tank1.tank_level), adjustForUTC(new Date(sensorData[1].tank1.reading_time)),
                    sensorData[1].tank2.tank_level, calcVolFromHeight(sensorData[1].tank2.tank_level), adjustForUTC(new Date(sensorData[1].tank2.reading_time)),
                    sensorData[1].tank3.tank_level, calcVolFromHeight(sensorData[1].tank3.tank_level), adjustForUTC(new Date(sensorData[1].tank3.reading_time)),
                    sensorData[1].tank4.tank_level, calcVolFromHeight(sensorData[1].tank4.tank_level), adjustForUTC(new Date(sensorData[1].tank4.reading_time)),
                    sensorData[1].tank5.tank_level, calcVolFromHeight(sensorData[1].tank5.tank_level), adjustForUTC(new Date(sensorData[1].tank5.reading_time)),
                ]
            )
        }
    } catch (error) {
        console.error(`There was an error inserting tank and vacuum data into the database ${error}`);
    }
}

module.exports = {insertData};