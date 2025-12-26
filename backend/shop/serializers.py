from rest_framework import serializers
from .models import Category, Plant

class CategorySerializer(serializers.ModelSerializer):
    plant_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'plant_count']
        read_only_fields = ['slug']

class PlantListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    discount_percent = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Plant
        fields = [
            'id', 'name', 'slug', 'category', 'category_id',
            'price', 'discount_price', 'discount_percent', 'current_price',
            'main_image', 'care_difficulty', 'in_stock',
            'is_featured', 'is_new', 'rating', 'created_at'
        ]
        read_only_fields = ['slug', 'rating', 'created_at']

class PlantDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    discount_percent = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Plant
        fields = [
            'id', 'name', 'slug', 'category', 'category_id',
            'description', 'price', 'discount_price', 'discount_percent', 'current_price',
            'care_difficulty', 'light_requirements', 'watering_frequency',
            'height', 'pot_diameter', 'main_image', 'additional_images',
            'in_stock', 'is_featured', 'is_new', 'rating', 'review_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'rating', 'review_count', 'created_at', 'updated_at']