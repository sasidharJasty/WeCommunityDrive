from django.urls import include, path
from django.urls import re_path
from rest_framework import routers
from django.urls import path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views
router = routers.DefaultRouter()
router.register(r'events', views.EventViewSet) 

urlpatterns = [
    path('04D2430AAFE10AA4/', include(router.urls)),
    path('04D2430AAFE10AA4/login/', views.LoginView.as_view(), name='login'),
    path('04D2430AAFE10AA4/logout/', views.logout_view, name='logout'),
    path('04D2430AAFE10AA4/signup/', views.SignupView.as_view(), name='signup'),
    path('04D2430AAFE10AA4/nearby/<str:lat>/<str:lon>/<str:dist>/', views.get_user_events, name='nearby'),  # Notice no parentheses after `get_user_events`
    path('04D2430AAFE10AA4/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('04D2430AAFE10AA4/change_password/', views.change_password, name='change_password'),
    path('04D2430AAFE10AA4/orgevent/', views.Event_View.as_view(), name='orgevent'),
    path('04D2430AAFE10AA4/events/<str:event_id>', views.get_event, name='getevent'),
    path('04D2430AAFE10AA4/add_item/<str:event_id>/<str:item>/<str:quantity>/', views.add_item, name='add_item'),
    path('04D2430AAFE10AA4/event/signup/<str:em>/<str:event_id>/', views.event_signup, name='event'),
    path('scan-barcode/', views.scan_barcode, name='scan_barcode'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='index'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)