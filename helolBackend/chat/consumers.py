# region Imports
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from .views import ChatViewSet
from .models import ChatMessage
from .services import get_answer, get_text_from_speech
from datetime import datetime
import asyncio
import base64
from django.core.files.base import ContentFile
# endregion

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        print(f"ChatConsumer connected for user: {self.user_id}")
        self.group_name = f"chat_{self.user_id}"
        self.chatMessage_id = None
        self.last_tempId = None  # 🔹 store tempId
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send_initial_data()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnections."""
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        self.last_tempId = content.get("tempId")  # 🔹 capture
        bot_message = content.get("bot_message")
        user_message = content.get("user_message")
        audio_base64 = content.get("audio")
        filename = content.get("filename")

        chat_message = None

        if audio_base64:
            # audio comes as "data:audio/webm;base64,<base64string>"
            try:
                format, b64data = audio_base64.split(";base64,")
                audio_data = base64.b64decode(b64data)
                if self.chatMessage_id:
                    chat_message = await database_sync_to_async(ChatMessage.objects.get)(id=self.chatMessage_id)
                    chat_message.audio_file = ContentFile(audio_data, name=filename)
                    await database_sync_to_async(chat_message.save)()
                else:
                    chat_message = await database_sync_to_async(ChatMessage.objects.create)(
                        user_id=self.user_id,
                        session=None,  # set session if you already track it
                        audio_file=ContentFile(audio_data, name=filename),
                    )
                print(f"✅ Saved audio file {filename} for user {self.user_id}")
            except Exception as e:
                print(f"❌ Error saving audio: {e}")

        else:
            if self.chatMessage_id:
                chat_message = await database_sync_to_async(ChatMessage.objects.get)(id=self.chatMessage_id)
                if bot_message:
                    chat_message.bot_message = bot_message
                else:
                    chat_message.user_message = user_message
                await database_sync_to_async(chat_message.save)()
            else:
                chat_message = await database_sync_to_async(ChatMessage.objects.create)(
                    user_id=self.user_id,
                    session=None,  # set session if available
                    bot_message=bot_message,
                    user_message=user_message,
                )
            print(f"✅ Saved text message for user {self.user_id}")

        # Only run bot processing for text messages

        if chat_message and chat_message.user_message:
            self.chatMessage_id = None
            print(f"Processing message for user {self.user_id}...")
            asyncio.create_task(self._process_response(chat_message.id, chat_message.user_message))

        elif chat_message and chat_message.audio_file:
            self.chatMessage_id = None
            print(f"Processing audio message for user {self.user_id}...")
            asyncio.create_task(self._process_response(chat_message.id, chat_message.audio_file.path, type="audio"))

        elif chat_message and chat_message.bot_message:
            print(f"Waiting for response from user {self.user_id}...")
            self.chatMessage_id = chat_message.id

    async def _process_response(self, message_id: int, message: str, type: str = "text"):
        """Background task to fetch response and update DB."""
        if type == "audio":
            message = await self.get_text(message)
        response = await get_answer(message)
        if response:
            response_time = datetime.now()

            def update_msg():
                chat_message = ChatMessage.objects.get(id=message_id)
                chat_message.bot_message = response
                chat_message.bot_message_time = response_time
                chat_message.save()
                return chat_message.user_id  # return for update trigger

            user_id = await sync_to_async(update_msg)()

            # 🔹 notify client with latest messages
            await self.send_update(user_id)

    async def get_text(self, audio_path):

        text = await get_text_from_speech(audio_path)
        return text

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
        data = await sync_to_async(viewset, thread_sensitive=True)()

        # 🔹 attach tempId if available
        if self.last_tempId:
            for msg in data:
                msg["tempId"] = self.last_tempId
            self.last_tempId = None

        await self.send_json(content=data)
