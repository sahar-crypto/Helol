from django.urls import path
from .views import CustomTokenObtainPairView, CustomTokenRefreshView

app_name = 'authentication'

token_generation = [
    # JWT Token generation endpoint
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Token refresh endpoint
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns = (
        token_generation
)
