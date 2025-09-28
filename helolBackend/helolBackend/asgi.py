"""
ASGI config for helolBackend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'helolBackend.settings')

initialize_application = get_asgi_application()
from chat.routing import chat_urlpatterns
print("WebSocket URL patterns:", chat_urlpatterns)
application = ProtocolTypeRouter({
    "http": initialize_application,
    "websocket": AuthMiddlewareStack(
        URLRouter(chat_urlpatterns),
    )
})