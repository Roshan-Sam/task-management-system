from django.contrib import admin
from .models import User,Task,CompletedTask,Comments
# Register your models here.

admin.site.register(User)
admin.site.register(Task)
admin.site.register(CompletedTask)
admin.site.register(Comments)