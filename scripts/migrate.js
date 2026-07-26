const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const sql = fs.readFileSync(
    path.join(__dirname, "..", "database", "init.sql"),
    "utf-8"
  )

  console.log("Running database migration...")
  await pool.query(sql)
  console.log("Migration completed successfully")
  await pool.end()
}

run().catch((err) => {
  console.error("Migration failed:", err)
  process.exit(1)
})