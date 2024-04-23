from rest_framework import serializers
from .models import  User,Task,CompletedTask,Comments


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = '__all__'
        
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        
class CompletedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompletedTask
        fields = '__all__'
        
class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = "__all__"  