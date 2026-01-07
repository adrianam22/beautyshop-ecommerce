from rest_framework import generics, permissions
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import exceptions

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["first_name"] = user.first_name or ""
        token["is_admin"] = user.is_staff

        return token

    def validate(self, attrs):
        # Allow login with username or email
        username_or_email = attrs.get("username")
        password = attrs.get("password")

        # Try to find user by username first
        user = None
        try:
            user = User.objects.get(username=username_or_email)
        except User.DoesNotExist:
            # If not found, try to find by email
            try:
                user = User.objects.get(email=username_or_email)
                # Use the actual username for authentication
                username_or_email = user.username
            except User.DoesNotExist:
                pass

        # Authenticate with the found username
        if user:
            credentials = {
                'username': username_or_email,
                'password': password
            }
            user = authenticate(**credentials)

        if not user:
            raise exceptions.AuthenticationFailed(
                'No active account found with the given credentials',
                'no_active_account',
            )

        if not user.is_active:
            raise exceptions.AuthenticationFailed(
                'User account is disabled.',
                'user_inactive',
            )

        refresh = self.get_token(user)

        data = {}
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['username'] = user.username
        data['email'] = user.email
        data['first_name'] = user.first_name or ""
        data['is_admin'] = user.is_staff

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = UserSerializer(user).data
        return Response(data)