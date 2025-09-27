# region Imports
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth import authenticate
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework import status
# endregion

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        """
        Handle POST requests to obtain a pair of JWT tokens (access and refresh) for authenticated users.

        This method authenticates the user using the provided email and password, and if successful,
        generates and returns a pair of JWT tokens along with user information.

        Parameters:
        request (HttpRequest): The HTTP request object containing metadata about the request, including
                               the user's email and password in the request data.
        *args: Additional positional arguments.
        **kwargs: Additional keyword arguments.

        Returns:
        Response: A Response object containing the JWT tokens and user information if authentication
                  is successful. If authentication fails, returns a Response with an error message
                  and a 401 status code.
        """
        # Extract email and password from request data
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate user using provided credentials
        user = authenticate(email=email, password=password)

        if user is None:
            # Return an error response if authentication fails
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user.last_login = now()
        user.save(update_fields=['last_login'])

        # Proceed with token generation
        response = super().post(request, *args, **kwargs)

        # Include user information in the response
        final_response = Response({
            'access': response.data['access'],
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.full_name,
                'national_id': user.national_id,
                'role': user.get_user_role(),
                "user_group": user.groups.values_list('name', flat=True),
            }
        }, status=status.HTTP_200_OK)

        # Set cookies
        final_response.set_cookie(
            key="access_token",
            value=response.data['access'],
            httponly=True,
            secure=True,         # Make sure your site runs on HTTPS
            samesite='Lax',
            max_age=15*60,         # 15 minutes
        )

        final_response.set_cookie(
            key="refresh",
            value=response.data['refresh'],
            httponly=True,
            secure=True,
            samesite='Lax',
            max_age=7 * 24 * 60 * 60  # 7 days
        )

        return final_response

# Standard TokenRefreshView for refreshing tokens
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        """
        Overrides the default TokenRefreshView to extract the refresh token from cookies.
        """

        refresh_token = request.COOKIES.get('refresh')

        if not refresh_token:
            return Response({'detail': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Inject the refresh token into request data so that the parent class can handle it
        request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200 and 'access' in response.data:
            # Set new access token in HTTP-only cookie
            response.set_cookie(
                key="access_token",
                value=response.data['access'],
                httponly=True,
                secure=True,          # Use HTTPS
                samesite='Lax',
                max_age=15 * 60,      # 15 minutes
            )

        return response

