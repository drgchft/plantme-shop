from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.contrib.auth.models import User
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, 
    UserSerializer, UserUpdateSerializer
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            
            response_data = {
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'nickname': user.profile.nickname,
                    'email': user.email,
                },
                'token': token.key,
                'message': 'Регистрация успешно завершена'
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data
            token, created = Token.objects.get_or_create(user=user)
            
            avatar_url = None
            if user.profile.avatar:
                avatar_url = request.build_absolute_uri(user.profile.avatar.url)
            
            banner_url = None
            if user.profile.banner:
                banner_url = request.build_absolute_uri(user.profile.banner.url)
            
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'nickname': user.profile.nickname,
                    'email': user.email,
                    'avatar': avatar_url,
                    'banner': banner_url,
                    'status': user.profile.get_status_display(),
                },
                'token': token.key,
                'message': 'Вход выполнен успешно'
            })
        
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        
        logout(request)
        return Response({'message': 'Выход выполнен успешно'})

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'username'
    
    def get_queryset(self):
        return User.objects.all()