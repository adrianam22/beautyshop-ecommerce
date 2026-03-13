from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'password', 'is_admin')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True}
        }

    def get_is_admin(self, obj):
        return obj.is_staff

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
