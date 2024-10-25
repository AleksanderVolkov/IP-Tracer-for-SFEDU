
from django.contrib import admin
from django.urls import path, include
from django.urls import re_path as url
from backend_api.views import *
from backend_api.views import OpenTelegramLink


urlpatterns = [
    path('admin/', admin.site.urls),
    #path('', YouTubeVideoView.as_view(), name = 'oh shit'),
    path('GetRequestIP_DNS', GetRequestIP_DNS.as_view()),
    #path('IP_or_DNS_informathion', IP_or_DNS_informathion.as_view())
    path('api/get-data/', GetDataFromDB.as_view(), name='get_data'),
    path('api/delete-item', DeleteItemFromDB.as_view(), name='delete-item'),
    path('open-telegram', OpenTelegramLink.as_view(), name='open_telegram'),
]


