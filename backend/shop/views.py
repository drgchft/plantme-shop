from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Category, Plant
from .serializers import CategorySerializer, PlantListSerializer, PlantDetailSerializer

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class PlantListView(generics.ListCreateAPIView):
    serializer_class = PlantListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'in_stock', 'is_featured', 'is_new', 'care_difficulty']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'rating', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Plant.objects.all()
        
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        
        return queryset
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        
        return Response({
            'success': True,
            'count': response.data['count'],
            'next': response.data.get('next'),
            'previous': response.data.get('previous'),
            'results': response.data['results']
        })

class PlantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class PlantSearchView(generics.ListAPIView):
    serializer_class = PlantListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        
        if query:
            return Plant.objects.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(category__name__icontains=query)
            ).distinct()
        
        return Plant.objects.none()

class FeaturedPlantsView(generics.ListAPIView):
    serializer_class = PlantListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Plant.objects.filter(is_featured=True, in_stock=True)[:8]

class NewPlantsView(generics.ListAPIView):
    serializer_class = PlantListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Plant.objects.filter(is_new=True, in_stock=True)[:8]