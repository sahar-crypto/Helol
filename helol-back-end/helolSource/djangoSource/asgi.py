"""
ASGI config for helolSource project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helolSource.settings')

initialize_application = get_asgi_application()
from chat.routing import chat_urlpatterns
print("WebSocket URL patterns:", chat_urlpatterns)
application = ProtocolTypeRouter({
    "http": initialize_application,
    "websocket": URLRouter(chat_urlpatterns),
})