# region Imports
from .models import ChatMessage
# endregion

class ChatViewSet:

    def __init__(self, user_id):
        self.user_id = user_id

    def __call__(self):
        return self.get_user_messages()

    def get_user_messages(self):

        messages = ChatMessage.objects.filter(
            user_id=self.user_id
        ).order_by('-message_time')

        data = []

        for message in messages:

            message_id = message.id
            message_text = message.message
            response_text = message.response
            message_date = message.message_time.strftime("%Y-%m-%d")
            message_time = message.message_time.strftime("%H:%M")
            response_date = message.response_time.strftime("%Y-%m-%d")
            response_time = message.response_time.strftime("%H:%M")

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
