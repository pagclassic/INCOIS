/* eslint-disable */
const { readFileSync } = require('fs')
const { resolve } = require('path')
const { Client } = require('pg')
require('dotenv').config()

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set in environment (.env)')
    process.exit(1)
  }

  const fileArg = process.argv[2]
  const migrationPath = fileArg
    ? resolve(process.cwd(), fileArg)
    : resolve(__dirname, '../../db/migrations/0001_init.sql')

  const sql = readFileSync(migrationPath, 'utf8')
  const client = new Client({ connectionString: databaseUrl })
  await client.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Migration applied:', migrationPath)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Migration failed:', err.message)
    process.exitCode = 1
  } finally {
    await client.end()
  }
}

main()

