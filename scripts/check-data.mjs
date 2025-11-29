import pg from 'pg'
const { Client } = pg

const DB_PASSWORD = process.argv[2] || 'hysves-Tesxoc-dyxbu6'
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.fhftuzgicesrsybkufxe.supabase.co:5432/postgres`
const client = new Client({ connectionString })

async function checkData() {
  try {
    await client.connect()
    console.log('✅ Connected\n')

    // Check each table
    const tables = ['m365_features', 'cloud_solutions', 'cybersecurity_services', 'benefits', 'testimonials']

    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`)
      console.log(`${table}: ${result.rows[0].count} rows`)
    }

    // Show actual data
    console.log('\n--- M365 Features ---')
    const features = await client.query('SELECT title FROM m365_features ORDER BY position')
    features.rows.forEach(r => console.log(`  - ${r.title}`))

    console.log('\n--- Cloud Solutions ---')
    const cloud = await client.query('SELECT title FROM cloud_solutions ORDER BY position')
    cloud.rows.forEach(r => console.log(`  - ${r.title}`))

    console.log('\n--- Cybersecurity ---')
    const cyber = await client.query('SELECT title FROM cybersecurity_services ORDER BY position')
    cyber.rows.forEach(r => console.log(`  - ${r.title}`))

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

checkData()
