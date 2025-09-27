# region Imports
from rest_framework import serializers
from .models import *
# endregion

class NeighborhoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Neighborhood
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = '__all__'

class GovernmentalAuthoritySerializer(serializers.ModelSerializer):

    class Meta:
        model = GovernmentalAuthority
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Service
        fields = '__all__'
