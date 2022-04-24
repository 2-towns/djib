Djib bot is a bot allowing to order product online (book, clothers...)

# Initialize

## Database migration

Run the install command:

```
python -m pip install .
```

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

Copy the https URL and add it as a prefix of the `URL` variable into the .env file. You should have something like `https://ad7b-41-98-224-108.eu.ngrok.io/bot/AZAZ...`

Access to your telegram Bot. You should receive a `Coucou` message.
