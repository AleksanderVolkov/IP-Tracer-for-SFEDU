from rest_framework import serializers
from .models import YouTubeVideo
from .models import IP_or_DNS_information


class IP_or_DNS_information_serializer(serializers.ModelSerializer):
    class Meta:
        model = IP_or_DNS_information
        fields = ['ip']











#################################################
# class YouTubeVideoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = YouTubeVideo
#         fields = ['title', 'channel']

