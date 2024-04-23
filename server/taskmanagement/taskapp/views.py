from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from .serializers import  UserSerializer,TaskSerializer,CompletedTaskSerializer,CommentsSerializer
from .models import  User, Task, CompletedTask,Comments
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verifytoken(request):
    token = request.headers.get('Authorization', '').split(' ')[1]

    if not token:
        return Response({"message": "Token is missing"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        decoded_token = AccessToken(token)
        decoded_token_payload = decoded_token.payload
        user_id = decoded_token_payload['user_id']

        return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)
    except:
        return Response({"message": "Token is not valid"}, status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data,partial=True)
    if serializer.is_valid():
        username=serializer.validated_data.get('username')
        password=serializer.validated_data.get('password')
        email=serializer.validated_data.get('email')
        userdata=User.objects.create_user(username=username,password=password,email=email)
        return Response({'message':'User created successfully'}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def login(request):
    username=request.data['username']
    password = request.data['password']
    
    if not (username and password):
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user =authenticate(username=username,password=password)
    
    if user is None:
        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh  = RefreshToken.for_user(user)
    user_details = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'profile':user.profile.url,
        'admin':user.admin
    }    
    return Response({'token': str(refresh.access_token), 'user': user_details}, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getusers(request):
    normal_users = User.objects.filter(admin=False)
    serializer = UserSerializer(normal_users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addtask(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Task added succesfully"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def gettasks(requet):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gettask(request,pk):
    try:
        task=Task.objects.get(id=pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"message": "Task does not exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edittask(request,pk):
    try:
        task = Task.objects.get(id=pk)
        serializer = TaskSerializer(task,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Task.DoesNotExist:
        return Response({"message": "Task does not exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletetask(request,pk):
    try:
        task = Task.objects.get(id=pk)
        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"message": "Task does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getsubmittedtasks(request):
    try:
        submittedtasks = CompletedTask.objects.all()
        serializer = CompletedTaskSerializer(submittedtasks,many=True).data
        for obj in serializer:
            user_data = User.objects.get(id=obj['user'])
            serialized_user = UserSerializer(user_data).data
            user = {
            'id':serialized_user['id'],
            'username':serialized_user['username'],
            'profile':serialized_user.get('profile', None)
            }
            obj['user'] = user 
        return Response(serializer,status=status.HTTP_200_OK)
    except CompletedTask.DoesNotExist:
        return Response({"message":"No submitted tasks found"},status=status.HTTP_404_NOT_FOUND)   
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_users(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
        assigned_user_ids = task.assigned_to.all()
        users = User.objects.filter(id__in=assigned_user_ids)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"message": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletecomment(request,pk):
    try:
        comment = Comments.objects.get(id=pk)
        comment.delete()
        return Response({"message":"Comment has been deleted successfully."},status=status.HTTP_200_OK)
    except Comments.DoesNotExist:
        return Response({"message":"The comment you are trying to delete was not found."},status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateprofile(request,user_id):
    try:
        user = User.objects.get(pk=user_id)
        serializer = UserSerializer(user, data=request.data ,partial=True)
        if serializer.is_valid():
            serializer.save()
            user_details = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'profile': user.profile.url,
                'admin': user.admin
            }
            return Response({"user":user_details},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteprofile(request,user_id):
    user = User.objects.get(pk=user_id)
    user.delete()
    return Response({'message': 'User deleted successfully'},status=status.HTTP_200_OK)

    
# users api routes
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getusertasks(request,pk):
    try:
        tasks = Task.objects.filter(assigned_to=pk)
        serializer = TaskSerializer(tasks,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"message": "No tasks found for this user"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getcompletedtasks(request,pk):
    try:
        tasks = CompletedTask.objects.filter(user=pk)
        serializer = CompletedTaskSerializer(tasks,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    except CompletedTask.DoesNotExist:
        return Response({"message":"No completed tasks found for this user"},status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def completedtask(request):
    task_id = request.data['task']
    user_id = request.data['user']
    description = request.data['description']
    task_image = request.data['image']
    title = request.data['title']
    created_date = request.data['createdDate']
    completed_date = request.data['completedDate']
    
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({'message': 'Task does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
    task.assigned_to.remove(user_id)

    if not task.assigned_to.exists():
        task.status ='Completed'
        task.save()
    
    completed_task_data = {
        'user': user_id,
        'task': task_id,
        'description': description,
        'task_image': task_image,
        'title': title,  
        'created_date': created_date,  
        'completed_date': completed_date
    }
    completed_task_serializer = CompletedTaskSerializer(data=completed_task_data)
    if completed_task_serializer.is_valid():
        completed_task_serializer.save()
        return Response({'message': 'Task completed successfully'}, status=status.HTTP_200_OK)

    else:
        return Response(completed_task_serializer.errors, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getsingletask(request, pk):
    try:
        task = Task.objects.get(id=pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Task.DoesNotExist:
        return Response({"message": "Task does not exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gettaskcreatedby(request,pk):
    try:
        createdby = User.objects.get(id=pk)
        serializer = UserSerializer(createdby)
        
        createdbydata = serializer.data
        createdbydata.pop('password',None)
        return Response(createdbydata, status=status.HTTP_200_OK)
    except:
        return Response({"message": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addcomment(request):
    serializer = CommentsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Comment added successfully"}, status=status.HTTP_200_OK)
    return Response({"message":"Facing error in adding comment"},serializer.errors,status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getcomments(request,pk):
    try:
        comments = Comments.objects.filter(task=pk)
        serialized_comments = CommentsSerializer(comments,many=True).data
        for comment in serialized_comments:
            user_data = User.objects.get(id=comment['user'])
            serialized_user = UserSerializer(user_data).data
            user = {
            'id':serialized_user['id'],
            'username':serialized_user['username'],
            'profile':serialized_user.get('profile', None)
            }
            comment['user'] = user 
        
        return Response(serialized_comments,status=status.HTTP_200_OK)
    except Comments.DoesNotExist:
        return Response({'message': 'Comments not found'},status=status.HTTP_404_NOT_FOUND)
        

        
    
    
    