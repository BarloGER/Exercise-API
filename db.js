const { Pool } = require("pg");

const connectionString = process.env.PG_CONNECTIONSTRING;

const pool = new Pool({
    connectionString,
});

module.exports = pool;