# region Imports
from .models import *
from .serializers import *
from rest_framework.viewsets import ModelViewSet
# endregion

class NewsMessageViewSet(ModelViewSet):

    queryset = NewsMessage.objects.all()
    serializer_class = NewsMessageSerializer
    permission_classes = []

