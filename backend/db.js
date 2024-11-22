// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.qvegzqjpfcyynrvkwshk:antonovdanya14@aws-0-eu-west-3.pooler.supabase.com:6543/postgres',
});

module.exports = pool;
