// supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qvegzqjpfcyynrvkwshk.supabase.co'; // Ваш URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2ZWd6cWpwZmN5eW5ydmt3c2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMjkxNzYsImV4cCI6MjA0NzcwNTE3Nn0.bgFNKrg_eBwkxh5nMO2d4_n4Xir7WHY70ZLfoVLeXE4'; // Ваш ключ доступа
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
