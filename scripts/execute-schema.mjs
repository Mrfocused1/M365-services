import pg from 'pg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get database password from environment or command line
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || process.argv[2]

if (!DB_PASSWORD) {
  console.error('❌ Database password required!')
  console.log('\nUsage:')
  console.log('  node scripts/execute-schema.mjs YOUR_DB_PASSWORD')
  console.log('  or set SUPABASE_DB_PASSWORD environment variable\n')
  console.log('📍 Find your database password at:')
  console.log('   https://supabase.com/dashboard/project/fhftuzgicesrsybkufxe/settings/database')
  console.log('   Under "Database Settings" → "Database Password"\n')
  process.exit(1)
}

// Direct database connection (better for schema operations)
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.fhftuzgicesrsybkufxe.supabase.co:5432/postgres`

console.log('🔌 Connecting to Supabase database...\n')

const client = new Client({ connectionString })

async function executeSchema() {
  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // Read the SQL schema file
    const sqlPath = path.join(__dirname, '..', 'supabase-schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

    console.log('📝 Executing SQL schema...\n')

    // Execute the entire SQL file
    await client.query(sqlContent)

    console.log('✅ Database schema executed successfully!\n')
    console.log('🎯 Your database is now ready!')
    console.log('   Visit http://localhost:3000/admin to manage your content\n')

  } catch (error) {
    console.error('❌ Error executing schema:', error.message)
    console.error('\nFull error:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

executeSchema()
