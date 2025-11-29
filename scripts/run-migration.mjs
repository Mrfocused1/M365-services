import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || process.argv[2]

if (!DB_PASSWORD) {
  console.error('❌ Database password required!')
  console.log('\nUsage: node scripts/run-migration.mjs YOUR_DB_PASSWORD\n')
  process.exit(1)
}

const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.fhftuzgicesrsybkufxe.supabase.co:5432/postgres`
const client = new Client({ connectionString })

async function runMigration() {
  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    const sqlPath = path.join(__dirname, 'add-new-tables.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

    console.log('📝 Running migration...\n')
    await client.query(sqlContent)

    console.log('✅ Migration completed successfully!\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
