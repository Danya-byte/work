import asyncio
import json
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from supabase_config import supabase  # Импортируем подключение к Supabase

# Настройки логирования
logging.basicConfig(level=logging.INFO)

# Список амбассадоров
AMBASSADORS = ["backend_creator"]

# Токен бота
TOKEN = '8102571059:AAHLHrmuq3Dmu7rtEIKNn0PNPu07UeYnCTU'
bot = Bot(token=TOKEN)
dp = Dispatcher()

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
        # Проверка пользователя в базе данных Supabase
        check_user_query = supabase.from_('participants').select('position, referral_number').or_(f'username.eq.{username},telegram_id.eq.{telegram_id}')
        check_user_result = check_user_query.execute().data
        position = check_user_result[0]['position'] if check_user_result else None
        referral_number = check_user_result[0]['referral_number'] if check_user_result else None

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
        # Проверка пользователя в базе данных Supabase
        check_user_query = supabase.from_('participants').select('position, referral_number').or_(f'username.eq.{username},telegram_id.eq.{message.from_user.id}')
        check_user_result = check_user_query.execute().data
        position = check_user_result[0]['position'] if check_user_result else None
        referral_number = check_user_result[0]['referral_number'] if check_user_result else None

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
            join_button = InlineKeyboardButton(text='Join', web_app={'url': 'https://work-2-tau.vercel.app/'})
            keyboard = InlineKeyboardMarkup(inline_keyboard=[[join_button]])
            await message.answer(f'Welcome back! You are at position {position}.', reply_markup=keyboard)
            logging.info(f"Welcome message sent to user {username} with ID {message.from_user.id}")
        else:
            join_button = InlineKeyboardButton(text='Join', web_app={'url': 'https://work-2-tau.vercel.app/'})
            keyboard = InlineKeyboardMarkup(inline_keyboard=[[join_button]])
            await message.answer('Welcome! Please complete the following steps to join:', reply_markup=keyboard)
            logging.info(f"Join message sent to user {username} with ID {message.from_user.id}")

    except Exception as e:
        logging.error(f"Error checking user: {e}")
        await message.answer('An error occurred. Please try again later.')
        logging.info(f"Error occurred while checking user {username} with ID {message.from_user.id}")

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())