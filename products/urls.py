from django.urls import path
from .views import ProductSearchView
from .views import (
    CategoryListCreate, CategoryDetail, ProductListCreateView, ProductDetailView,
    WishlistView, CartView, CartItemView, OrderListView, OrderDetailView,
    ProductPDFView, RegenerateAllPDFsView
)

urlpatterns = [
    path("categories/", CategoryListCreate.as_view()),
    path("categories/<int:pk>/", CategoryDetail.as_view()),

    path("", ProductListCreateView.as_view()),
    path("<int:pk>/", ProductDetailView.as_view()),
    path("<int:pk>/pdf/", ProductPDFView.as_view()),

    # Regenerate PDFs
    path("regenerate-pdfs/", RegenerateAllPDFsView.as_view()),  # POST → regenerate all
    # POST to /<pk>/pdf/ → regenerate single product (admin only)

    # Wishlist endpoints
    path("wishlist/", WishlistView.as_view()),

    # Cart endpoints
    path("cart/", CartView.as_view()),
    path("cart/items/<int:item_id>/", CartItemView.as_view()),

    # Order endpoints
    path("orders/", OrderListView.as_view()),
    path("orders/<int:order_id>/", OrderDetailView.as_view()),
    path("search/", ProductSearchView.as_view()),
]