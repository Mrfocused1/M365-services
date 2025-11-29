import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = 'https://fhftuzgicesrsybkufxe.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('Reading SQL schema file...')
    const sqlPath = path.join(__dirname, '..', 'supabase-schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8')

    // Split SQL into individual statements (simple split by semicolon)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`Found ${statements.length} SQL statements to execute...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'

      // Skip comments
      if (statement.trim().startsWith('--')) continue

      console.log(`Executing statement ${i + 1}/${statements.length}...`)

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement })

        if (error) {
          console.error(`Error in statement ${i + 1}:`, error.message)
          // Continue with other statements
        } else {
          console.log(`✓ Statement ${i + 1} executed successfully`)
        }
      } catch (err: any) {
        console.error(`Error executing statement ${i + 1}:`, err.message)
      }
    }

    console.log('\n✅ Database setup complete!')
  } catch (error: any) {
    console.error('❌ Error setting up database:', error.message)
    process.exit(1)
  }
}

setupDatabase()
