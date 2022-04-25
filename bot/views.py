import json
from http.client import HTTPResponse

import requests
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from djib.settings import NGROK_HOST

from bot.telegram import TELEGRAM_BASE_URL

# Create your views here.

app_name = 'bot'


def index(request):
    return render(request, 'bot/index.html')


@csrf_exempt
def digest_message(request):
    response_data = {}
    response_data['result'] = 'error'

    body = json.loads(request.body)

    print(body)

    payload = {'chat_id': body["message"]["from"]["id"], 'text': 'Coucou fds'}

    host = request.get_host()

    if NGROK_HOST != "":
        url = "https://"+NGROK_HOST+"/bot"
    else:
        url = "https://"+request.get_host()+"/bot"

    button = {
        "text": "WebApp",
        "web_app": {
            #
            "url": url
        }
    }
    print(json.dumps([button]))

    payload["reply_markup"] = json.dumps({
        "inline_keyboard": [[button]]
    })

    r = requests.get(url=TELEGRAM_BASE_URL + "/sendMessage", params=payload)
    print(r.url)
    print(r.json())

    return JsonResponse({})
