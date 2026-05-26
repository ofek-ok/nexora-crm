import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env.local');

let supabaseUrl = '';
let supabaseKey = '';

try {
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');
  for (const line of lines) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = val;
    }
  }
} catch (e) {
  console.error('Error reading env file:', e);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRegister() {
  const email = 'ofekokonski99@gmail.com';
  const fullName = 'Ofek Ok';
  const role = 'admin';

  console.log('1. Checking if user exists...');
  const { data: exists, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (checkError) {
    console.error('Check Error:', checkError);
    return;
  }
  console.log('Exists result:', exists);

  if (exists) {
    console.log('User already exists, cannot register.');
    return;
  }

  console.log('2. Inserting new user...');
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert({
      email: email.toLowerCase(),
      full_name: fullName,
      role: role
    })
    .select()
    .single();

  if (insertError) {
    console.error('Insert Error:', insertError);
    return;
  }

  console.log('Register Success:', newUser);
}

testRegister();
