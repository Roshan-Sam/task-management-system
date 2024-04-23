from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    profile = models.ImageField(upload_to='profile/',default='default profile.jpg',null=True,blank=True)
    admin = models.BooleanField(default=False,null=True,blank=True)

class Task(models.Model):
    title = models.CharField(max_length=100,null=True,blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks',null=True,blank=True)
    assigned_to = models.ManyToManyField(User, related_name='assigned_tasks',blank=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='Pending')

class CompletedTask(models.Model):
    task = models.IntegerField(null=True, blank=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,blank=True)
    description = models.TextField(null=True,blank=True)
    task_image = models.ImageField(upload_to='completed_task/',null=True,blank=True)
    created_date = models.DateTimeField(null=True, blank=True)
    completed_date =models.DateTimeField(null=True,blank=True)
    title = models.CharField(max_length=100,null=True,blank=True)
    status = models.CharField(max_length=20, default='Completed')
    
class Comments(models.Model):
    comment = models.TextField(null=True,blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True)
    task = models.IntegerField(null=True, blank=True)


