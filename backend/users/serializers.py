from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import UserProfile
import re

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'nickname', 'first_name', 'last_name', 'middle_name',
            'gender', 'email', 'phone', 'avatar', 'banner', 'bio',
            'status', 'created_at', 'agree_personal', 'agree_offer', 'agree_privacy'
        ]
        read_only_fields = ['created_at', 'status']
        extra_kwargs = {
            'nickname': {'required': True, 'max_length': 50},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone': {'required': True},
        }
    
    def validate_first_name(self, value):
        if not re.match(r'^[а-яА-ЯёЁ\s-]+$', value):
            raise serializers.ValidationError('Имя должно содержать только кириллические буквы')
        return value
    
    def validate_last_name(self, value):
        if not re.match(r'^[а-яА-ЯёЁ\s-]+$', value):
            raise serializers.ValidationError('Фамилия должна содержать только кириллические буквы')
        return value
    
    def validate_middle_name(self, value):
        if value and not re.match(r'^[а-яА-ЯёЁ\s-]+$', value):
            raise serializers.ValidationError('Отчество должно содержать только кириллические буквы')
        return value
    
    def validate_phone(self, value):
        if not re.match(r'^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$', value):
            raise serializers.ValidationError('Телефон должен быть в формате: +7 (XXX) XXX-XX-XX')
        return value

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, min_length=3)
    nickname = serializers.CharField(required=True, max_length=50)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    middle_name = serializers.CharField(required=False, allow_blank=True)
    gender = serializers.ChoiceField(choices=UserProfile.GENDER_CHOICES, default='U')
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, required=True)
    agree_personal = serializers.BooleanField(required=True)
    agree_offer = serializers.BooleanField(required=True)
    agree_privacy = serializers.BooleanField(required=True)
    
    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError('Логин должен содержать только латинские буквы, цифры и underscore')
        if len(value) < 3:
            raise serializers.ValidationError('Логин должен быть не менее 3 символов')
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Пользователь с таким логином уже существует')
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Пользователь с таким email уже существует')
        return value
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Пароли не совпадают'})
        
        if not (data['agree_personal'] and data['agree_offer'] and data['agree_privacy']):
            raise serializers.ValidationError('Необходимо согласие со всеми документами')
        
        return data
    
    def create(self, validated_data):
        # Создаем пользователя
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Создаем профиль
        profile_data = {
            'nickname': validated_data['nickname'],
            'first_name': validated_data['first_name'],
            'last_name': validated_data['last_name'],
            'middle_name': validated_data.get('middle_name', ''),
            'gender': validated_data['gender'],
            'phone': validated_data['phone'],
            'agree_personal': validated_data['agree_personal'],
            'agree_offer': validated_data['agree_offer'],
            'agree_privacy': validated_data['agree_privacy'],
        }
        
        profile = UserProfile.objects.create(user=user, **profile_data)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        
        if user and user.is_active:
            if hasattr(user, 'profile') and user.profile.status == 'blocked':
                raise serializers.ValidationError("Ваш аккаунт заблокирован")
            return user
        raise serializers.ValidationError("Неверный логин или пароль")

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']
        read_only_fields = ['id', 'username']

class UserUpdateSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(partial=True)
    
    class Meta:
        model = User
        fields = ['email', 'profile']
    
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        
        if 'email' in validated_data:
            instance.email = validated_data['email']
        
        instance.save()
        
        if hasattr(instance, 'profile') and profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                if attr not in ['status', 'created_at', 'agree_personal', 'agree_offer', 'agree_privacy']:
                    setattr(profile, attr, value)
            profile.save()
        
        return instance