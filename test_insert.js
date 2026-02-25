const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    console.log("Testing review insert...")
    const { data, error } = await supabase.from('visitor_reviews').insert({
        name: 'Test Setup',
        review: 'This is a test review.',
    })
    console.log("Error:", error)
    console.log("Data:", data)
}

test()
