# region Imports
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from rest_framework.viewsets import ModelViewSet
# endregion

class NeighborhoodViewSet(ModelViewSet):

    queryset = Neighborhood.objects.all()
    serializer_class = NeighborhoodSerializer
    permission_classes = []

class UserViewSet(ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []

class GovernmentalAuthorityViewSet(ModelViewSet):

    queryset = GovernmentalAuthority.objects.all()
    serializer_class = GovernmentalAuthoritySerializer
    permission_classes = []

class ServiceViewSet(ModelViewSet):

    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = []
