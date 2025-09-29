# region Imports
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .views import ChatViewSet
from .models import ChatMessage
from .services import get_answer
from datetime import datetime
import asyncio
# endregion

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        print(f"ChatConsumer connected for user: {self.user_id}")
        self.group_name = f"chat_{self.user_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_initial_data()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnections."""
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):

        message = content.get("message")
        print(f"Received message: {message}")
        audio = content.get("audio")
        # Save message to the database
        chat_message = await database_sync_to_async(ChatMessage.objects.create)(
            user_id=self.user_id,
            message=message,
            audio_file=audio if audio else None,
        )

        asyncio.create_task(self._process_response(chat_message.id, message))

    async def _process_response(self, message_id: int, message: str):
        """Background task to fetch response and update DB."""
        response = await get_answer(message)
        if response:
            response_time = datetime.now()

            def update_msg():
                chat_message = ChatMessage.objects.get(id=message_id)
                chat_message.response = response
                chat_message.response_time = response_time
                chat_message.save()
                return chat_message.user_id  # return for update trigger

            user_id = await sync_to_async(update_msg)()

            # 🔹 notify client with latest messages
            await self.send_update(user_id)

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
            lambda: ChatViewSet(user_id=self.user_id, latest=True),
            thread_sensitive=True
        )()
        data = await sync_to_async(
            viewset,
            thread_sensitive=True
        )()

        print(f"Sending update for user: {user_id}...")
        print(data)
        await self.send_json(content=data)
