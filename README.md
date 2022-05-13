# Djib bot

Djib bot is a bot allowing to order product online (book, clothers...)

# Install

## Dependencies

Run the install command:

```
python -m pip install -r requirements.txt
```

## Settings

Copy the file djib/settings_template.py to djib/settings.py and made the changes that you need.

## Database migration

Run the migrate command:

```
python manage.py migrate
```

## Telegram Bot creation

For development purpose, create your own bot with [BotFather](https://telegram.me/BotFather).

Get the token and use it in the Django App.

## Ain configuration

Install [Ain](https://github.com/jonaslu/ain) then create a .env file (look at the .env.example template.) Replace the `TOKEN` variable by the telegram bot token (in the URL variable to).

## Ngrok

Download [Ngrok](https://ngrok.com) and put it into the root folder of the application.

# Run

Start the run server:

```
python manage.py runserver
```

Start ngrok:

```
./ngrok http 8000
```

Copy the https URL and add it as a prefix of the `URL` variable into the .env file. Take the right side of the telegram token after `:`. Example with: XXX:YYYYYYY, you should have something like `https://ad7b-41-98-224-108.eu.ngrok.io/bot/YYYYYYY...`

You have to update the `NGROK_HOST` in your settings.

Access to your telegram Bot. You should receive a `Coucou` message.
