from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Профиль'
    fields = [
        'nickname', 'first_name', 'last_name', 'middle_name',
        'gender', 'phone', 'avatar', 'banner', 'bio',
        'agree_personal', 'agree_offer', 'agree_privacy'
    ]

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'get_nickname', 'get_phone', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'profile__nickname', 'profile__first_name', 'profile__last_name')
    
    def get_nickname(self, obj):
        return obj.profile.nickname if hasattr(obj, 'profile') else '-'
    get_nickname.short_description = 'Никнейм'
    
    def get_phone(self, obj):
        return obj.profile.phone if hasattr(obj, 'profile') else '-'
    get_phone.short_description = 'Телефон'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('nickname', 'get_user_email', 'get_username', 'phone', 'gender', 'created_at')
    list_filter = ('gender', 'created_at')
    search_fields = ('nickname', 'user__username', 'user__email', 'phone', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'
    get_user_email.admin_order_field = 'user__email'
    
    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Логин'
    get_username.admin_order_field = 'user__username'
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'nickname', 'first_name', 'last_name', 'middle_name', 'gender')
        }),
        ('Контактная информация', {
            'fields': ('phone',)
        }),
        ('Профиль', {
            'fields': ('avatar', 'banner', 'bio')
        }),
        ('Соглашения', {
            'fields': ('agree_personal', 'agree_offer', 'agree_privacy'),
            'classes': ('collapse',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )