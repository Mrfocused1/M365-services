import pg from 'pg'
import fs from 'fs'
const { Client } = pg

const DB_PASSWORD = process.argv[2] || 'hysves-Tesxoc-dyxbu6'
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.fhftuzgicesrsybkufxe.supabase.co:5432/postgres`
const client = new Client({ connectionString })

async function populateServices() {
  try {
    await client.connect()
    console.log('✅ Connected\n')

    const sql = fs.readFileSync('scripts/populate-services.sql', 'utf-8')
    await client.query(sql)

    console.log('✅ Services populated successfully!\n')

    const result = await client.query('SELECT COUNT(*) FROM services')
    console.log(`✅ Services in database: ${result.rows[0].count}\n`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

populateServices()
