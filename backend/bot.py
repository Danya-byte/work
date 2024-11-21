import asyncio
import json
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from asyncpg import Pool, create_pool

# Настройки логирования
logging.basicConfig(level=logging.INFO)

# Настройки подключения к базе данных
DB_CONFIG = {
    'user': 'postgres',
    'host': '127.0.0.1',
    'database': 'greenwoods',
    'password': 'Dkflbvbhjdbx76',
    'port': 5432,
}

# Список амбассадоров
AMBASSADORS = ["backend_creator"]

# Токен бота
TOKEN = '8102571059:AAHLHrmuq3Dmu7rtEIKNn0PNPu07UeYnCTU'
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Создание пула подключений к базе данных
pool: Pool = None

async def create_db_pool():
    global pool
    pool = await create_pool(**DB_CONFIG)

@dp.message(Command("start"), lambda message: message.chat.id == message.from_user.id)
async def start_command(message: types.Message):
    chat_id = message.chat.id
    username = message.from_user.username
    telegram_id = message.from_user.id

    logging.info(f"/start command received from user {username} with ID {telegram_id}")

    if not username:
        logging.info(f"Username is missing for user with ID {telegram_id}")
        await message.answer('Please set a username in your Telegram profile to continue.')
        return

    try:
        async with pool.acquire() as connection:
            check_user_query = ('SELECT position, referral_number FROM participants WHERE username = $1 OR telegram_id '
                                '= $2')
            check_user_result = await connection.fetchrow(check_user_query, username, telegram_id)
            position = check_user_result['position'] if check_user_result else None
            referral_number = check_user_result['referral_number'] if check_user_result else None

        logging.info(f"User {username} with ID {telegram_id} checked in the database. Position: {position}, Referral Number: {referral_number}")

        user_state = {
            'username': username,
            'position': position is not None,
            'referralNumber': referral_number,
            'isAmbassador': username in AMBASSADORS
        }

        with open('userState.json', 'w') as f:
            json.dump(user_state, f)

        logging.info(f"User state saved for user {username} with ID {telegram_id}")

        if position is not None:
            join_button = InlineKeyboardButton(text='Join', web_app={'url': 'https://work-2-tau.vercel.app'})
            keyboard = InlineKeyboardMarkup(inline_keyboard=[[join_button]])
            await message.answer(f'Welcome back! You are at position {position}.', reply_markup=keyboard)
            logging.info(f"Welcome message sent to user {username} with ID {telegram_id}")
        else:
            join_button = InlineKeyboardButton(text='Join', web_app={'url': 'https://work-2-tau.vercel.app'})
            keyboard = InlineKeyboardMarkup(inline_keyboard=[[join_button]])
            await message.answer('Welcome! Please complete the following steps to join:', reply_markup=keyboard)
            logging.info(f"Join message sent to user {username} with ID {telegram_id}")

    except Exception as e:
        logging.error(f"Error checking user: {e}")
        await message.answer('An error occurred. Please try again later.')
        logging.info(f"Error occurred while checking user {username} with ID {telegram_id}")

@dp.message(lambda message: message.chat.id == message.from_user.id)
async def check_username(message: types.Message):
    chat_id = message.chat.id
    username = message.from_user.username

    logging.info(f"Message received from user {username} with ID {message.from_user.id}")

    if not username:
        logging.info(f"Username is missing for user with ID {message.from_user.id}")
        await message.answer('Please set a username in your Telegram profile to continue.')
        return

    try:
        async with pool.acquire() as connection:
            check_user_query = 'SELECT position, referral_number FROM participants WHERE username = $1 OR telegram_id = $2'
            check_user_result = await connection.fetchrow(check_user_query, username, message.from_user.id)
            position = check_user_result['position'] if check_user_result else None
            referral_number = check_user_result['referral_number'] if check_user_result else None

        logging.info(f"User {username} with ID {message.from_user.id} checked in the database. Position: {position}, Referral Number: {referral_number}")

        user_state = {
            'username': username,
            'position': position is not None,
            'referralNumber': referral_number,
            'isAmbassador': username in AMBASSADORS
        }

        with open('userState.json', 'w') as f:
            json.dump(user_state, f)

        logging.info(f"User state saved for user {username} with ID {message.from_user.id}")

        if position is not None:
            join_button = InlineKeyboardButton(text='Join', web_app={'url': 'https://work-2-tau.vercel.app'})
            keyboard = InlineKeyboardMarkup(inline_keyboard=[[join_button]])
            await message.answer(f'Welcome back! You are at position {position}.', reply_markup=keyboard)
            logging.info(f"Welcome message sent to user {username} with ID {message.from_user.id}")
        else:
            join_button = InlineKeyboardButton(text='Join', web_app={'url': 'https://work-2-tau.vercel.app'})
            keyboard = InlineKeyboardMarkup(inline_keyboard=[[join_button]])
            await message.answer('Welcome! Please complete the following steps to join:', reply_markup=keyboard)
            logging.info(f"Join message sent to user {username} with ID {message.from_user.id}")

    except Exception as e:
        logging.error(f"Error checking user: {e}")
        await message.answer('An error occurred. Please try again later.')
        logging.info(f"Error occurred while checking user {username} with ID {message.from_user.id}")

async def main():
    await create_db_pool()
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())