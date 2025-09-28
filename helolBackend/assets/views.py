# region Imports
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import *
from .serializers import *
from utils.endpointhandling.responses import success_response, error_response
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


@api_view(['GET'])
def get_user_by_national_id(request):
    try:
        full_name = request.GET.get('full_name')
        national_id = request.GET.get('national_id')
        user, created = User.objects.get_or_create(
            national_id=national_id,
            defaults={'full_name': full_name}
        )
        serializer = UserSerializer(user)
        return success_response(data=serializer.data)

    except Exception as e:
        message = f"Error while fetching user by national ID: {e}"
        return error_response(message=message)