from flask import Flask, jsonify
import asyncio
import asyncpg
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)

# Глобальная переменная для пула подключений
pool = None

# Глобальный пул потоков для выполнения асинхронных задач
executor = ThreadPoolExecutor(max_workers=5)

# Глобальный цикл событий
main_loop = asyncio.new_event_loop()


async def init_pool():
    global pool
    max_retries = 5  # Максимальное количество попыток подключения
    retries = 0
    while retries < max_retries:
        try:
            pool = await asyncpg.create_pool(user='postgres', password='Dkflbvbhjdbx76',
                                             database='greenwoods', host='127.0.0.1', port=5432)
            print("Database pool initialized successfully")
            return pool  # Возвращаем объект пула
        except (
        asyncpg.ConnectionDoesNotExistError, asyncpg.CannotConnectNowError, asyncpg.ConnectionFailureError) as e:
            retries += 1
            print(f"Failed to initialize database pool, retrying ({retries}/{max_retries})...")
            await asyncio.sleep(2)  # Пауза перед повторной попыткой
    raise RuntimeError("Failed to initialize database pool after multiple retries")


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
        print("Database initialized")  # Добавляем отладочный вывод


async def get_total_members():
    async with pool.acquire() as conn:
        count = await conn.fetchval("SELECT COUNT(*) FROM participants")
        print(f"Total members: {count}")  # Добавляем отладочный вывод
    return count


def run_async_task(coro):
    return asyncio.run_coroutine_threadsafe(coro, main_loop).result()


@app.route('/api/total-members', methods=['GET'])
def total_members():
    if pool is None:
        return jsonify({'error': 'Database pool is not initialized'}), 500

    # Запускаем асинхронную задачу в отдельном потоке
    future = executor.submit(run_async_task, get_total_members())
    total = future.result()

    return jsonify({'totalMembers': total})


def main():
    global pool
    try:
        pool = run_async_task(init_pool())  # Используем один и тот же цикл для инициализации пула
        run_async_task(initialize_db())  # И для инициализации базы данных
    except RuntimeError as e:
        print(f"Failed to initialize database: {e}")
        return
    app.run(host='0.0.0.0', port=5000)


if __name__ == '__main__':
    main()