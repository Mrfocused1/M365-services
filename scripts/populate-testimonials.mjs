import pg from 'pg'
import fs from 'fs'
const { Client } = pg

const DB_PASSWORD = process.argv[2] || 'hysves-Tesxoc-dyxbu6'
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.fhftuzgicesrsybkufxe.supabase.co:5432/postgres`
const client = new Client({ connectionString })

async function populateTestimonials() {
  try {
    await client.connect()
    console.log('✅ Connected\n')

    const sql = fs.readFileSync('scripts/populate-testimonials.sql', 'utf-8')
    await client.query(sql)

    console.log('✅ Testimonials populated successfully!\n')

    const result = await client.query('SELECT * FROM testimonials ORDER BY position')
    console.log(`✅ Testimonials in database: ${result.rows.length}\n`)
    result.rows.forEach(t => {
      console.log(`- ${t.author_name} (${t.author_role}, ${t.author_company})`)
      console.log(`  "${t.text}"\n`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

populateTestimonials()
