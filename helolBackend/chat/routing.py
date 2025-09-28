# region Imports
from django.urls import re_path
from .consumers import ChatConsumer
# endregion

chat_urlpatterns = [
    re_path(r"ws/chat_consumer/(?P<user_id>\d+)/$", ChatConsumer.as_asgi()),
]

