from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.register),
    path('login/',views.login),
    path('verifytoken/',views.verifytoken),
    path('getusers/',views.getusers),
    path('admin/addtask/',views.addtask),
    path('admin/gettasks/',views.gettasks),
    path('admin/gettask/<int:pk>/',views.gettask),
    path('admin/edittask/<int:pk>/',views.edittask),
    path('admin/deletetask/<int:pk>/', views.deletetask),
    path('admin/getsubmittedtasks/', views.getsubmittedtasks),
    path('admin/getassignedusers/<int:task_id>/', views.get_assigned_users),
    path('admin/getsingletaskadmin/<int:pk>/', views.getsingletask),
    path('admin/getcomments/<int:pk>/', views.getcomments),
    path('admin/addcomment/', views.addcomment),
    path('admin/deletecomment/<int:pk>/', views.deletecomment),
    path('admin/updateprofile/<int:user_id>/', views.updateprofile),
    path('admin/deleteprofile/<int:user_id>/', views.deleteprofile),
    
    path('user/tasks/<int:pk>/',views.getusertasks),
    path('user/completed/',views.completedtask),
    path('user/getcompletedtasks/<int:pk>/',views.getcompletedtasks),
    path('user/getsingletask/<int:pk>/',views.getsingletask),
    path('user/gettaskcreatedby/<int:pk>/',views.gettaskcreatedby),
    path('user/addcomment/',views.addcomment),
    path('user/getcomments/<int:pk>/',views.getcomments),
    path('user/deletecomment/<int:pk>/', views.deletecomment),
    path('user/updateprofile/<int:user_id>/', views.updateprofile),
    path('user/deleteprofile/<int:user_id>/', views.deleteprofile),
]