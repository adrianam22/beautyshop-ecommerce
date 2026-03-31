from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from decimal import Decimal
from .models import Category, Product, Wishlist, Cart, CartItem, Order, OrderItem
from .serializers import (
    CategorySerializer, ProductSerializer, WishlistSerializer,
    CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer
)
from .utils import search_products_tfidf


class CategoryListCreate(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetail(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return None

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"detail": "Not found"}, status=404)

        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response({"detail": "Not found"}, status=404)

        category.delete()
        return Response(status=204)


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = Product.objects.all()
        category = self.request.query_params.get("category")

        if category:
            qs = qs.filter(category_id=category)

        return qs


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_update(self, serializer):
        instance = serializer.save()
        # Regenerate PDF after every update (signal handles it automatically,
        # but we refresh the instance so the response contains the new pdf_file)
        instance.refresh_from_db(fields=['pdf_file'])


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    def post(self, request):
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({"detail": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
            if product in wishlist.products.all():
                return Response({"detail": "Product already in wishlist"}, status=status.HTTP_400_BAD_REQUEST)
            wishlist.products.add(product)
            serializer = WishlistSerializer(wishlist)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        wishlist = get_object_or_404(Wishlist, user=request.user)
        product_id = request.data.get('product_id')

        if not product_id:
            return Response({"detail": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
            wishlist.products.remove(product)
            serializer = WishlistSerializer(wishlist)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({"detail": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)

            if product.stock < quantity:
                return Response(
                    {"detail": f"Only {product.stock} items available in stock"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )

            if not created:
                new_quantity = cart_item.quantity + quantity
                if product.stock < new_quantity:
                    return Response(
                        {"detail": f"Only {product.stock} items available in stock"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.quantity = new_quantity
                cart_item.save()

            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            cart_item.delete()
            cart = Cart.objects.get(user=request.user)
            serializer = CartSerializer(cart)
            return Response(serializer.data)

        if cart_item.product.stock < quantity:
            return Response(
                {"detail": f"Only {cart_item.product.stock} items available in stock"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    def delete(self, request, item_id):
        cart_item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        cart_item.delete()
        cart = Cart.objects.get(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)

        if cart.items.count() == 0:
            return Response(
                {"detail": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        for item in cart.items.all():
            if item.product.stock < item.quantity:
                return Response(
                    {"detail": f"Insufficient stock for {item.product.name}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        total = cart.get_total()

        order = Order.objects.create(
            user=request.user,
            total=total,
            shipping_name=request.data.get('shipping_name'),
            shipping_email=request.data.get('shipping_email'),
            shipping_phone=request.data.get('shipping_phone'),
            shipping_address=request.data.get('shipping_address'),
            shipping_city=request.data.get('shipping_city'),
            shipping_postal_code=request.data.get('shipping_postal_code'),
            shipping_country=request.data.get('shipping_country', 'Romania'),
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()

        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)


import re
import os


def _pdf_filename(product_name):
    """Return a clean filename based on product name."""
    safe = re.sub(r'[^\w\s-]', '', product_name).strip()
    safe = re.sub(r'[\s]+', '_', safe)
    return f'BeautyShop_{safe}.pdf'


def _regenerate_pdf(product):
    """Generate PDF, save path to DB, return the path."""
    from .utils import generate_product_pdf
    from django.conf import settings
    pdf_path = generate_product_pdf(product)
    Product.objects.filter(pk=product.pk).update(pdf_file=pdf_path)
    product.refresh_from_db(fields=['pdf_file'])
    return pdf_path


class ProductPDFView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        """Serve the PDF for a product, generating it if missing."""
        from django.conf import settings
        product = get_object_or_404(Product, pk=pk)

        # Generate if missing or file no longer exists on disk
        needs_regen = (
                not product.pdf_file or
                not os.path.exists(os.path.join(settings.MEDIA_ROOT, product.pdf_file.name))
        )
        if needs_regen:
            _regenerate_pdf(product)

        try:
            file_path = os.path.join(settings.MEDIA_ROOT, product.pdf_file.name)
            with open(file_path, 'rb') as f:
                response = HttpResponse(f.read(), content_type='application/pdf')
                response['Content-Disposition'] = f'inline; filename="{_pdf_filename(product.name)}"'
                return response
        except Exception as e:
            raise Http404(f"Error serving PDF: {str(e)}")

    def post(self, request, pk):
        """Force-regenerate the PDF for a single product. Admin only."""
        if not request.user.is_staff:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        product = get_object_or_404(Product, pk=pk)
        _regenerate_pdf(product)
        return Response({"detail": f"PDF regenerated for '{product.name}'."}, status=status.HTTP_200_OK)


class RegenerateAllPDFsView(APIView):
    """
    GET  /api/products/regenerate-pdfs/  — regenerate all PDFs (open in browser)
    POST /api/products/regenerate-pdfs/  — same, for programmatic use
    Both require admin/staff login.
    """
    permission_classes = [IsAdminUser]

    def _run(self):
        products = Product.objects.all()
        success, failed = [], []
        for product in products:
            try:
                _regenerate_pdf(product)
                success.append({"id": product.id, "name": product.name})
            except Exception as e:
                failed.append({"id": product.id, "name": product.name, "error": str(e)})
        return success, failed

    def get(self, request):
        success, failed = self._run()
        from django.http import HttpResponse as HR
        lines = [f"<h2>PDF Regeneration Complete</h2>"]
        lines.append(f"<p><b>Regenerated: {len(success)}</b></p>")
        lines.append("<ul>")
        for p in success:
            lines.append(f"<li>✅ [{p['id']}] {p['name']}</li>")
        lines.append("</ul>")
        if failed:
            lines.append(f"<p><b>Failed: {len(failed)}</b></p><ul>")
            for p in failed:
                lines.append(f"<li>❌ [{p['id']}] {p['name']} — {p['error']}</li>")
            lines.append("</ul>")
        return HR("<br>".join(lines))

    def post(self, request):
        success, failed = self._run()
        return Response({
            "regenerated": len(success),
            "failed": len(failed),
            "failed_details": failed,
        }, status=status.HTTP_200_OK)

class ProductSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        query = request.GET.get("q", "")

        if not query:
            return Response([])

        products = Product.objects.all()

        results = search_products_tfidf(query, products)

        serializer = ProductSerializer(results, many=True)

        return Response(serializer.data)