from django.contrib import admin
from .models import Category, Plant

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'plant_count')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    
    def plant_count(self, obj):
        return obj.plants.count()
    plant_count.short_description = 'Количество растений'

@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'current_price', 'in_stock', 'rating', 'created_at')
    list_filter = ('category', 'in_stock', 'is_featured', 'is_new', 'care_difficulty')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at', 'rating', 'review_count')
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'category', 'description')
        }),
        ('Цены', {
            'fields': ('price', 'discount_price')
        }),
        ('Характеристики', {
            'fields': ('care_difficulty', 'light_requirements', 'watering_frequency', 
                      'height', 'pot_diameter')
        }),
        ('Изображения', {
            'fields': ('main_image', 'additional_images')
        }),
        ('Статусы', {
            'fields': ('in_stock', 'is_featured', 'is_new', 'rating', 'review_count')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at')
        }),
    )   