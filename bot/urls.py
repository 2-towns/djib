from django.urls import path

from . import views

app_name = 'bot'

urlpatterns = [
    path('', views.index, name='index'),
    path('AAGa1U8xnM6dL6ePJJCU_Ma7Un7GQm0JqgY', views.digest_message),
]
