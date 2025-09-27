# region Imports
from rest_framework import serializers
from .models import ChatMessage
# endregion


class ChatMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatMessage
        fields = '__all__'

