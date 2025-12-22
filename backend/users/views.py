from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserLoginSerializer, UserUpdateSerializer
from .models import UserProfile
import json

class RegisterView(generics.CreateAPIView):
    """Регистрация нового пользователя"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'message': 'Пользователь успешно зарегистрирован',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'nickname': user.profile.nickname if hasattr(user, 'profile') else user.username
                },
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        
        errors = {}
        for field, error_list in serializer.errors.items():
            if field == 'profile':
                for profile_field, profile_errors in error_list.items():
                    errors[profile_field] = profile_errors
            else:
                errors[field] = error_list
        
        return Response({
            'success': False,
            'message': 'Ошибка валидации',
            'errors': errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """Вход пользователя"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'success': True,
                    'message': 'Вход выполнен успешно',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'nickname': user.profile.nickname if hasattr(user, 'profile') else user.username
                    },
                    'token': token.key
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Неверный логин или пароль'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'message': 'Ошибка валидации',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """Выход пользователя"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        logout(request)
        
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
        except Token.DoesNotExist:
            pass
        
        return Response({
            'success': True,
            'message': 'Выход выполнен успешно'
        })

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Получение и обновление профиля пользователя"""
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        
        return Response({
            'success': True,
            'user': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            self.perform_update(serializer)
            
            return Response({
                'success': True,
                'message': 'Профиль успешно обновлен',
                'user': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Ошибка валидации',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(generics.RetrieveAPIView):
    """Публичный просмотр профиля пользователя (по username)"""
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'username'
    
    def get_queryset(self):
        return User.objects.all()
    
    def retrieve(self, request, *args, **kwargs):
        try:
            user = self.get_object()
            
            return Response({
                'success': True,
                'user': {
                    'username': user.username,
                    'nickname': user.profile.nickname if hasattr(user, 'profile') else user.username,
                    'avatar': user.profile.avatar.url if hasattr(user, 'profile') and user.profile.avatar else None,
                    'bio': user.profile.bio if hasattr(user, 'profile') else ''
                }
            })
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Пользователь не найден'
            }, status=status.HTTP_404_NOT_FOUND)