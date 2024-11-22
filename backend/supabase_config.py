# supabase_config.py
from supabase import create_client, Client

supabase_url = 'https://qvegzqjpfcyynrvkwshk.supabase.co'  # Ваш URL
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2ZWd6cWpwZmN5eW5ydmt3c2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMjkxNzYsImV4cCI6MjA0NzcwNTE3Nn0.bgFNKrg_eBwkxh5nMO2d4_n4Xir7WHY70ZLfoVLeXE4'  # Ваш ключ доступа
supabase: Client = create_client(supabase_url, supabase_key)
