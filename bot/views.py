import json
from http.client import HTTPResponse

import requests
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from bot.telegram import TELEGRAM_BASE_URL

# Create your views here.


def index(request):
    return HTTPResponse("")


@csrf_exempt
def digest_message(request):
    response_data = {}
    response_data['result'] = 'error'

    body = json.loads(request.body)

    print(body)

    payload = {'chat_id': body["message"]["from"]["id"], 'text': 'Coucou'}

    return requests.get(url=TELEGRAM_BASE_URL + "/sendMessage", params=payload)
