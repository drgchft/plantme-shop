from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
import re

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'nickname', 'first_name', 'last_name', 'middle_name',
            'gender', 'email', 'phone', 'avatar', 'banner', 'bio',
            'created_at'
        ]
        read_only_fields = ['created_at']
        extra_kwargs = {
            'nickname': {'required': True, 'max_length': 50},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone': {'required': True},
        }
    
    def validate_first_name(self, value):
        """Проверка: только кириллица для имени"""
        if not re.match(r'^[а-яА-ЯёЁ\s-]+$', value):
            raise serializers.ValidationError('Имя должно содержать только кириллические буквы')
        return value
    
    def validate_last_name(self, value):
        """Проверка: только кириллица для фамилии"""
        if not re.match(r'^[а-яА-ЯёЁ\s-]+$', value):
            raise serializers.ValidationError('Фамилия должна содержать только кириллические буквы')
        return value
    
    def validate_middle_name(self, value):
        """Проверка: только кириллица для отчества"""
        if value and not re.match(r'^[а-яА-ЯёЁ\s-]+$', value):
            raise serializers.ValidationError('Отчество должно содержать только кириллические буквы')
        return value

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'profile']
        extra_kwargs = {
            'username': {
                'required': True,
                'min_length': 3,
                'validators': []
            },
            'email': {'required': True},
        }
    
    def validate_username(self, value):
        """Проверка: только латиница для логина"""
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError('Логин должен содержать только латинские буквы, цифры и underscore')
        if len(value) < 3:
            raise serializers.ValidationError('Логин должен быть не менее 3 символов')
        return value
    
    def validate(self, data):
        """Дополнительная валидация"""
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Пользователь с таким логином уже существует'})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Пользователь с таким email уже существует'})
        
        return data
    
    def create(self, validated_data):
        """Создание пользователя с профилем"""
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password
        )
        
        UserProfile.objects.create(
            user=user,
            username=validated_data['username'],
            **profile_data
        )
        
        return user

class UserLoginSerializer(serializers.Serializer):
    """Сериализатор для входа"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

class UserUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления профиля"""
    profile = UserProfileSerializer(partial=True)
    
    class Meta:
        model = User
        fields = ['email', 'profile']
    
    def update(self, instance, validated_data):
        """Обновление пользователя и профиля"""
        profile_data = validated_data.pop('profile', {})
        
        if 'email' in validated_data:
            instance.email = validated_data['email']
            instance.save()
        
        if hasattr(instance, 'profile') and profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        
        return instance