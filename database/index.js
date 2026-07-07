const { Pool } = require("pg")
require("dotenv").config()

/*
 * Single connection pool
 * Render-hosted Postgres REQUIRES SSL
 * This configuration works for:
 *  - Local development
 *  - Render production
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

module.exports = {
  async query(text, params) {
    try {
      return await pool.query(text, params)
    } catch (error) {
      console.error("Database query error:", error)
      throw error
    }
  },
}
