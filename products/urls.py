from django.urls import path
from .views import (
    CategoryListCreate, CategoryDetail, ProductListCreateView, ProductDetailView,
    WishlistView, CartView, CartItemView, OrderListView, OrderDetailView
)

urlpatterns = [
    path("categories/", CategoryListCreate.as_view()),
    path("categories/<int:pk>/", CategoryDetail.as_view()),

    path("", ProductListCreateView.as_view()),
    path("<int:pk>/", ProductDetailView.as_view()),

    # Wishlist endpoints
    path("wishlist/", WishlistView.as_view()),

    # Cart endpoints
    path("cart/", CartView.as_view()),
    path("cart/items/<int:item_id>/", CartItemView.as_view()),

    # Order endpoints
    path("orders/", OrderListView.as_view()),
    path("orders/<int:order_id>/", OrderDetailView.as_view()),
]