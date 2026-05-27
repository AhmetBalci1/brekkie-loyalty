const { Pool } = require("pg");

const pool = new Pool({

  connectionString:
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`,

  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;