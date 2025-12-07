from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "description", "specifications",
            "price", "stock", "supplier", "delivery_method",
            "category", "category_name", "image"
        ]
