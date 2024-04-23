# Task Management System

This is a project task management system built using React for the frontend and Django with MySQL for the backend.

## Installation

### Backend

1. Navigate to the `server` directory:
    ```bash
    cd server\taskmanagement
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Make sure MySQL is installed and running.

4. Configure database settings in `settings.py`:
    ```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'your_database_name',
            'USER': 'your_database_user',
            'PASSWORD': 'your_database_password',
            'HOST': 'localhost',
            'PORT': '3306',
        }
    }
    ```

5. Run database migrations:
    ```bash
    py manage.py makemigrations
    py manage.py migrate
    ```

6. Run the Django server:
    ```bash
    py manage.py runserver
    ```

### Frontend

1. Navigate to the `client` directory:
    ```bash
    cd client\taskmanagement
    ```

2. Initialize npm:
    ```bash
    npm init -y
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

## Usage

### Admin

- Admin users can register and login.
- Admin can add tasks with title, current date, due date, status, and assign tasks to multiple users.
- Admin can delete and edit tasks.
- Admin can check task status and pending users.
- Admin can view completed tasks of users with completion date, task details, and screenshots.
- Admin can add comments and view all comments. Admin can also delete comments of all users.
- Admin can update and delete their profile.

### Users

- Normal users can register and login.
- Users can view tasks assigned to them.
- Users can submit tasks with screenshots.
- Users can view their completed tasks.
- Users can add comments to tasks and delete their own comments.
- Users can update and delete their profile.

## Authentication

Authentication is handled using JWT tokens.

## Technologies Used

- React
- Django
- MySQL
- JWT Authentication
