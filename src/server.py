from flask import Flask, jsonify
import asyncio
import asyncpg

app = Flask(__name__)

# Глобальная переменная для пула подключений
pool = None

async def init_pool():
    global pool
    max_retries = 5  # Максимальное количество попыток подключения
    retries = 0
    while retries < max_retries:
        try:
            pool = await asyncpg.create_pool(user='postgres', password='Dkflbvbhjdbx76',
                                             database='greenwoods', host='127.0.0.1', port=5432)
            return
        except (asyncpg.ConnectionDoesNotExistError, asyncpg.CannotConnectNowError, asyncpg.ConnectionFailureError) as e:
            retries += 1
            print(f"Failed to initialize database pool, retrying ({retries}/{max_retries})...")
            await asyncio.sleep(2)  # Пауза перед повторной попыткой
    raise RuntimeError("Failed to initialize database pool after multiple retries")

# Функция для инициализации базы данных и таблиц
async def initialize_db():
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS participants (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                position INTEGER NOT NULL,
                ambassador_username TEXT,
                referral_number INTEGER UNIQUE,
                invited_by TEXT,
                is_winner TEXT DEFAULT NULL,
                secret_key TEXT,
                ambassador_id INTEGER,
                telegram_id BIGINT,
                EWE BIGINT,
                EWI BIGINT,
                ECI BIGINT
            )
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS ambassadors (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                chat_id BIGINT NOT NULL
            )
        """)

# Функция для получения общего количества участников
async def get_total_members():
    async with pool.acquire() as conn:
        count = await conn.fetchval("SELECT COUNT(*) FROM participants")
    return count

@app.route('/api/total-members', methods=['GET'])
async def total_members():
    total = await get_total_members()
    return jsonify({'totalMembers': total})

async def main():
    await init_pool()
    await initialize_db()
    app.run(host='0.0.0.0', port=5000)

if __name__ == '__main__':
    asyncio.run(main())