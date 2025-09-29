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
            message = ChatMessage.objects.filter(user_id=self.user_id).order_by("-message_time").first()
            messages = [message] if message else []

        else:
            messages = ChatMessage.objects.filter(
                user_id=self.user_id
            ).order_by('message_time')

        data = []

        for message in messages:

            message_id = message.id
            message_text = message.message
            message_timestamp = convert_timezone(message.message_time)
            message_date = message_timestamp.strftime("%Y-%m-%d")
            message_time = message_timestamp.strftime("%H:%M")
            if message.response:
                response_text = message.response
                response_timestamp = convert_timezone(message.response_time)
                response_date = response_timestamp.strftime("%Y-%m-%d")
                response_time = response_timestamp.strftime("%H:%M")
            else:
                response_text = None
                response_date = None
                response_time = None

            row = {
                "id": message_id,
                "message": message_text,
                "response": response_text,
                "message_date": message_date,
                "message_time": message_time,
                "response_date": response_date,
                "response_time": response_time,
            }

            data.append(row)

        return data
