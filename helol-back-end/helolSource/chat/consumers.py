# region Imports
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .views import ChatViewSet
from .models import ChatMessage
# endregion

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f"chat_{self.user_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def receive_json(self, content, **kwargs):
        data = json.loads(content)
        message = data.get("message")
        audio = data.get("audio")

        # Save message to the database
        await database_sync_to_async(ChatMessage.objects.create)(
            user_id=self.user_id,
            message=message,
            audio_file=audio if audio else None,
        )

    async def send_initial_data(self):
        """Fetch and send initial messages."""
        viewset = await sync_to_async(
            lambda: ChatViewSet(user_id=self.user_id),
            thread_sensitive=True
        )()
        data = await sync_to_async(
            viewset,
            thread_sensitive=True
        )()
        await self.send_json(content=data)

    async def send_update(self, user_id):
        """Handles real-time updates sent to the WebSocket group."""
        viewset = await sync_to_async(
            lambda: ChatViewSet(user_id=self.user_id),
            thread_sensitive=True
        )()
        data = await sync_to_async(
            viewset,
            thread_sensitive=True
        )()

        print(f"Sending update for user: {user_id}...")
        print(data)
        await self.send_json(content=data)
