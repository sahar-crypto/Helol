from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

app_name = 'assets'
router = DefaultRouter()
router.register('neighborhood', NeighborhoodViewSet)
router.register('user', UserViewSet)
router.register('governmental-authority', GovernmentalAuthorityViewSet)
router.register('service', ServiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]