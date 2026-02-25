const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    console.log("Testing realtime connection...")
    const channel = supabase.channel('test')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
            console.log('Change received!', payload)
        })
        .subscribe((status) => {
            console.log('Status:', status)
        })
}

test()
