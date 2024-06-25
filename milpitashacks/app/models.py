from django.contrib.auth.models import AbstractUser, Permission
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, group="Volunteer" , **extra_fields):
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, group="Admin",**extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"), unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    userType=models.CharField(max_length=200, default="Volunteer")
    username = models.CharField(max_length=150, unique=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    Event_Name = models.CharField(max_length=500)
    Event_Goal = models.CharField(max_length=2000)
    Event_Description = models.CharField(max_length=500)
    Event_Location = models.CharField(max_length=2000)
    Event_Time_Start = models.CharField(max_length=2000)
    Event_Time_End = models.CharField(max_length=2000)
    Volunteers = models.ManyToManyField(User, related_name='events', blank=True)
    items = models.TextField(default="{}")
    user_id = models.IntegerField(max_length=1000,default=0)
    Username = models.CharField(max_length=5000,default="Test")
    
    def __str__(self):
        return self.Event_Name