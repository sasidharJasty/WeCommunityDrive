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
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('nearby/<str:lat>/<str:lon>/<str:dist>/', views.get_user_events, name='nearby'), 
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('change_password/', views.change_password, name='change_password'),
    path('orgevent/', views.Event_View.as_view(), name='orgevent'),
    path('events/<str:event_id>', views.get_event, name='getevent'),
    path('add_item/', views.add_item, name='add_item'),
    path('edit_item/', views.edit_item, name='add_item'),
    path('delete_item/', views.delete_item, name='add_item'),
    path('participants/<str:user_id>/', views.participant_filter, name='participant_filter'),
    path('event/signup/<str:em>/<str:event_id>/', views.event_signup, name='event'),
    path('scan-barcode/', views.scan_barcode, name='scan_barcode'),
    path('registerevent/', views.Register_View.as_view(), name='registerview'),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='index'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)