from django.contrib import admin
from django.conf import settings
import os
from .models import Product, Category, Order, OrderItem


def clear_and_regenerate_pdfs(modeladmin, request, queryset):
    """Admin action: delete old PDF file from disk + DB, then regenerate with new format."""
    from .utils import generate_product_pdf

    regenerated = 0
    for product in queryset:
        # Delete old file from disk
        if product.pdf_file:
            try:
                old_path = os.path.join(settings.MEDIA_ROOT, product.pdf_file.name)
                if os.path.exists(old_path):
                    os.remove(old_path)
            except Exception:
                pass

        # Generate new PDF
        try:
            pdf_path = generate_product_pdf(product)
            Product.objects.filter(pk=product.pk).update(pdf_file=pdf_path)
            regenerated += 1
        except Exception as e:
            modeladmin.message_user(request, f"Error for '{product.name}': {e}", level='error')

    modeladmin.message_user(request, f"Successfully regenerated {regenerated} PDF(s).")

clear_and_regenerate_pdfs.short_description = "Clear old PDF and regenerate with new format"


def clear_pdfs_only(modeladmin, request, queryset):
    """Admin action: only delete PDF from disk and clear the field in DB."""
    cleared = 0
    for product in queryset:
        if product.pdf_file:
            try:
                old_path = os.path.join(settings.MEDIA_ROOT, product.pdf_file.name)
                if os.path.exists(old_path):
                    os.remove(old_path)
            except Exception:
                pass
            Product.objects.filter(pk=product.pk).update(pdf_file=None)
            cleared += 1

    modeladmin.message_user(request, f"Cleared PDF for {cleared} product(s).")

clear_pdfs_only.short_description = "Clear PDF file (delete from disk and DB)"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'stock', 'has_pdf']
    list_filter = ['category']
    search_fields = ['name']
    actions = [clear_and_regenerate_pdfs, clear_pdfs_only]

    def has_pdf(self, obj):
        return bool(obj.pdf_file)
    has_pdf.boolean = True
    has_pdf.short_description = 'PDF'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total', 'created_at']
    list_filter = ['status']
    search_fields = ['user__username', 'shipping_name']