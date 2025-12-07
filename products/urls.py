from django.urls import path
from .views import CategoryListCreate, CategoryDetail, ProductListCreateView, ProductDetailView

urlpatterns = [
    path("categories/", CategoryListCreate.as_view()),
    path("categories/<int:pk>/", CategoryDetail.as_view()),

    path("", ProductListCreateView.as_view()),
    path("<int:pk>/", ProductDetailView.as_view()),
]