from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.models import Group
from django.shortcuts import render
from django.http import JsonResponse
import json
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from .models import Event
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, ChangePasswordSerializer, EventSerializer
from django.conf import settings
import requests
from haversine import haversine, Unit
from requests.structures import CaseInsensitiveDict
from django.http import JsonResponse

User = get_user_model()

EMAIL_HOST_USER = settings.EMAIL_HOST_USER

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                update_session_auth_hash(request, user)
                return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['email']

class SignupView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ['post']

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        userType = request.data.get('userType')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        elif User.objects.filter(email=email).exists():
            return Response({'error': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = User.objects.create_user(username=username, email=email, password=password, userType=userType)

            token, created = Token.objects.get_or_create(user=user)

            return Response({'User': username, 'Username': user.username,  'type': userType, 'token': token.key})

class LoginView(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'User': username, 'Username': user.username, 'userType': user.userType, 'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

def soon(request):
    return render(request, "soon.html")

def pagenotfound(request):
    return render(request, "pagenotfound.html")

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful'})

class Event_View(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        '''
        Create an Event with given data
        '''
        serializer = EventSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['Username']

class Register_View(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        event_id = request.data.get('event_id')

        try:
            user = User.objects.get(id=user_id)
            event = Event.objects.get(id=event_id)

            if user in event.participants.all():
                return Response({'error': 'User is already registered for this event'}, status=status.HTTP_400_BAD_REQUEST)

            event.participants.add(user)
            event.save()

            return Response({'message': 'User registered successfully for the event'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Event.DoesNotExist:
            return Response({'error': 'Event does not exist'}, status=status.HTTP_404_NOT_FOUND)
        

from django.http import JsonResponse

@api_view(['GET'])
def get_user_events(request, lat, lon, dist):
    nearby_events = []
    distances = []
    events = Event.objects.all()
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"

    # Convert latitude and longitude to floats
    lat = float(lat)
    lon = float(lon)

    for event in events:
        location = event.Event_Location.replace(" ", "%20")
        url = f"https://api.geoapify.com/v1/geocode/search?text={location}&apiKey=4c52a2568f8a4cd7a1a8910836c479ca"
        resp = requests.get(url, headers=headers)
        data = resp.json()
        try:
            longitude = float(data['features'][0]['geometry']['coordinates'][0])
            latitude = float(data['features'][0]['geometry']['coordinates'][1])
            distance = haversine((latitude, longitude), (lat, lon), unit=Unit.MILES)
            if distance <= float(dist):
                nearby_events.append(event)
                distances.append(distance)
        except (IndexError, KeyError, ValueError):
            continue
    
    serializer = EventSerializer(nearby_events, many=True)
    return Response({'Events': serializer.data, 'Distances': distances}, status=status.HTTP_200_OK)

@api_view(['GET'])
def event_signup(request, em, event_id):
    user = get_object_or_404(User, email=em)
    event = get_object_or_404(Event, id=event_id)
    event.Volunteers.add(user)
    return Response('Success')

def scan_barcode(request):
    barcode_data = request.GET.get('barcode_data')
    return JsonResponse({'success': True})

import json

@api_view(['GET'])
def add_item(request, item, quantity, event_id):
    event = get_object_or_404(Event, id=event_id)
    
    if not isinstance(event.items, dict):
        try:
            event.items = json.loads(event.items)
        except (json.JSONDecodeError, TypeError):
            event.items = {}
    
    quantity = int(quantity)
    event.items[item] = event.items.get(item, 0) + quantity
    event.items = json.dumps(event.items)
    event.save()
    return JsonResponse({'event': event.items})

@api_view(['GET'])
def get_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    return JsonResponse({'event': event.items, 'name': event.Event_Name})