const { Pool } = require('pg');
const setting = require('../serverConfig');
// const pool = new Pool({
//     user: setting.user,
//     host: setting.dbIp,
//     database:setting.dbName,
//     password: Buffer.from(setting.password, 'base64').toString('ascii').trim(),
//     port: 5432,
// });
module.exports = {
    query: (text, params, callback) => {
        return true;
        // return pool.query(text, params, callback).catch((e) => {
        //     const error_text = e.toString();
        //     const sql_query = text;
        //     const query_params = params ? params.toString() : null;
        //     pool.query(`insert into logs.sql_error_logs (time, error_text, params, sql_query) values (
        //     NOW(), 
        //     '${error_text}', 
        //     ${query_params ? `'${query_params}'` : 'null'}, $$${sql_query}$$
        //     )`);
        //     console.log(e);
        // })
    }
};