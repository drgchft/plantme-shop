from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('plants/', views.PlantListView.as_view(), name='plant-list'),
    path('plants/<slug:slug>/', views.PlantDetailView.as_view(), name='plant-detail'),
    path('plants/search/', views.PlantSearchView.as_view(), name='plant-search'),
    path('plants/featured/', views.FeaturedPlantsView.as_view(), name='featured-plants'),
    path('plants/new/', views.NewPlantsView.as_view(), name='new-plants'),
]