# region Imports
from rest_framework import serializers
from .models import *
# endregion

class NewsMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = NewsMessage
        fields = '__all__'