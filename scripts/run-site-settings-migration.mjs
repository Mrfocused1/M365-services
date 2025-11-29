import pg from 'pg'
import fs from 'fs'
const { Client } = pg

const DB_PASSWORD = process.argv[2] || 'hysves-Tesxoc-dyxbu6'
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.fhftuzgicesrsybkufxe.supabase.co:5432/postgres`
const client = new Client({ connectionString })

async function runMigration() {
  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    const sql = fs.readFileSync('scripts/create-site-settings.sql', 'utf-8')
    await client.query(sql)

    console.log('✅ Site settings table created successfully!\n')

    const result = await client.query('SELECT * FROM site_settings')
    console.log('✅ Current settings:')
    console.log(result.rows)
    console.log()

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

runMigration()
