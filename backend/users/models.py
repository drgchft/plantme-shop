from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    """Расширенный профиль пользователя"""
    
    GENDER_CHOICES = [
        ('M', 'Мужской'),
        ('F', 'Женский'),
        ('U', 'Не указан'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    username = models.CharField('Логин', max_length=50, unique=True, 
                               help_text='Только латиница, минимум 3 символа')
    nickname = models.CharField('Никнейм', max_length=50, 
                               help_text='Виден всем пользователям')
    first_name = models.CharField('Имя', max_length=50, 
                                 help_text='Только кириллица')
    last_name = models.CharField('Фамилия', max_length=50, 
                                help_text='Только кириллица')
    middle_name = models.CharField('Отчество', max_length=50, blank=True, null=True,
                                  help_text='Только кириллица (необязательно)')
    gender = models.CharField('Пол', max_length=1, choices=GENDER_CHOICES, default='U')
    email = models.EmailField('Электронная почта', unique=True)
    phone = models.CharField('Телефон', max_length=20, 
                            help_text='Формат: +7 (XXX) XXX-XX-XX')
    
    avatar = models.ImageField('Аватар', upload_to='avatars/', blank=True, null=True)
    banner = models.ImageField('Баннер', upload_to='banners/', blank=True, null=True)
    bio = models.TextField('О себе', max_length=500, blank=True)
    
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    
    agreements = models.JSONField('Согласия', default=dict, blank=True)
    
    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.nickname} ({self.user.username})'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, username=instance.username)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()