import pg from 'pg'
import fs from 'fs'
const { Client } = pg

const DB_PASSWORD = process.argv[2] || 'hysves-Tesxoc-dyxbu6'
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.fhftuzgicesrsybkufxe.supabase.co:5432/postgres`
const client = new Client({ connectionString })

async function populateData() {
  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    const sql = fs.readFileSync('scripts/populate-default-data.sql', 'utf-8')
    console.log('📝 Inserting default data...\n')

    await client.query(sql)

    console.log('✅ Default data populated successfully!\n')

    // Verify
    const m365 = await client.query('SELECT COUNT(*) FROM m365_features')
    const cloud = await client.query('SELECT COUNT(*) FROM cloud_solutions')
    const cyber = await client.query('SELECT COUNT(*) FROM cybersecurity_services')

    console.log(`✅ M365 Features: ${m365.rows[0].count} items`)
    console.log(`✅ Cloud Solutions: ${cloud.rows[0].count} items`)
    console.log(`✅ Cybersecurity: ${cyber.rows[0].count} items\n`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

populateData()
