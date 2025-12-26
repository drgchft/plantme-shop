from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import RegexValidator

class UserProfile(models.Model):
    
    GENDER_CHOICES = [
        ('M', 'Мужской'),
        ('F', 'Женский'),
        ('U', 'Не указан'),
    ]
    
    USER_STATUS_CHOICES = [
        ('standard', 'Стандарт'),
        ('blocked', 'Заблокирован'),
        ('junior_admin', 'Младший администратор'),
        ('senior_admin', 'Старший администратор'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    nickname = models.CharField('Никнейм', max_length=50)
    first_name = models.CharField('Имя', max_length=50)
    last_name = models.CharField('Фамилия', max_length=50)
    middle_name = models.CharField('Отчество', max_length=50, blank=True, default='')
    gender = models.CharField('Пол', max_length=1, choices=GENDER_CHOICES, default='U')
    phone = models.CharField('Телефон', max_length=20, blank=True)
    
    avatar = models.ImageField('Аватар', upload_to='avatars/', blank=True, null=True)
    banner = models.ImageField('Баннер', upload_to='banners/', blank=True, null=True)
    bio = models.TextField('О себе', max_length=500, blank=True)
    
    status = models.CharField('Статус', max_length=20, choices=USER_STATUS_CHOICES, default='standard')
    agree_personal = models.BooleanField('Согласие на обработку ПД', default=False)
    agree_offer = models.BooleanField('Согласие с офертой', default=False)
    agree_privacy = models.BooleanField('Согласие с политикой конфиденциальности', default=False)
    
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)
    
    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.nickname} ({self.user.username})'
    
    @property
    def email(self):
        return self.user.email

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save() 