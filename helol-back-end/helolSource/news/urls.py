from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

app_name = 'news'
router = DefaultRouter()
router.register('news', NewsMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]