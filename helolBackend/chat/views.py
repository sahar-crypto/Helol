# region Imports
from .models import ChatMessage
from utils.projectkit.timezone import convert_timezone


# endregion

class ChatViewSet:

    def __init__(self, user_id, latest=False):
        self.user_id = user_id
        self.latest = latest

    def __call__(self):
        return self.get_user_messages()

    def get_user_messages(self):

        if self.latest:
            message = ChatMessage.objects.filter(
                user_id=self.user_id
            ).order_by("-user_message_time").first()
            messages = [message] if message else []

        else:
            messages = ChatMessage.objects.filter(
                user_id=self.user_id
            ).order_by('user_message_time')

        data = []

        for message in messages:
            message_id = message.id
            if message.audio_file:
                user_message = None
                audio_file = message.audio_file.url
                user_message_datetime = convert_timezone(message.user_message_time)
                user_message_date = user_message_datetime.strftime("%Y-%m-%d")
                user_message_time = user_message_datetime.strftime("%H:%M")
            elif message.user_message:
                audio_file = None
                user_message = message.user_message
                user_message_datetime = convert_timezone(message.user_message_time)
                user_message_date = user_message_datetime.strftime("%Y-%m-%d")
                user_message_time = user_message_datetime.strftime("%H:%M")
            else:
                user_message = None
                user_message_date = None
                user_message_time = None
                audio_file = None
            if message.bot_message:
                bot_message = message.bot_message
                bot_message_datetime = convert_timezone(message.bot_message_time)
                bot_message_date = bot_message_datetime.strftime("%Y-%m-%d")
                bot_message_time = bot_message_datetime.strftime("%H:%M")
            else:
                bot_message = None
                bot_message_date = None
                bot_message_time = None

            row = {
                "id": message_id,
                "user_message": user_message,
                "user_message_date": user_message_date,
                "user_message_time": user_message_time,
                "bot_message": bot_message,
                "bot_message_date": bot_message_date,
                "bot_message_time": bot_message_time,
                "audio_file": audio_file,
                "session": None,
            }

            data.append(row)

        return data
