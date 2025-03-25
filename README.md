# CriticsWorld Backend

CriticsWorld Backend is a Node.js-based backend application designed to manage movies, reviews, and user authentication. It provides RESTful APIs for various operations such as user management, movie management, and review management.

## Features

- **User Management**: Register, login, update, and delete user profiles.
- **Movie Management**: Add, update, delete, and search for movies.
- **Review Management**: Add, update, delete, and fetch reviews for movies.
- **Authentication**: Secure JWT-based authentication and role-based access control.
- **File Uploads**: Upload movie poster images.
- **Database Integration**: MySQL database for storing user, movie, and review data.
- **Error Handling**: Centralized error handling middleware.
- **Unit Testing**: Comprehensive test cases for APIs.

## Prerequisites

- Node.js (v18 or later)
- MySQL (v8 or later)
- Docker (optional, for containerized setup)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vinay-billa-slu/criticsworld-backend.git
   cd criticsworld-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```
   DB_HOST=your-database-host
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_NAME=criticsworld
   JWT_SECRET=your-jwt-secret
   PORT=8081
   ```

4. **Initialize the Database**:
   Import the `schema.sql` file into your MySQL database:
   ```bash
   mysql -u root -p criticsworld < schema.sql
   ```

5. **Run the Application**:
   ```bash
   npm start
   ```
   The application will start on `http://localhost:8081`.

6. **Run Tests**:
   ```bash
   npm test
   ```

7. **Docker Setup** (Optional):
   Build and run the application using Docker:
   ```bash
   docker-compose up --build
   ```

## Folder Structure

```
criticsworld-backend/
├── app.js                  # Main application entry point
├── config/                 # Configuration files
│   ├── db.js               # Database connection setup
│   ├── index.js            # Application configuration
├── controllers/            # Business logic for various modules
│   ├── Movie.js            # Movie-related logic
│   ├── Review.js           # Review-related logic
│   ├── User.js             # User-related logic
│   ├── sendMail.js         # Email sending logic
├── middleware/             # Middleware for authentication, error handling, etc.
│   ├── Auth.js             # Authentication middleware
│   ├── ErrorMiddleware.js  # Error handling middleware
│   ├── HttpException.js    # Custom exception class
│   ├── UploadMulter.js     # File upload middleware
├── public/                 # Static files (e.g., images)
├── routes/                 # API route definitions
│   ├── auth.js             # Authentication routes
│   ├── movie.js            # Movie routes
│   ├── review.js           # Review routes
│   ├── user.js             # User routes
├── test/                   # Unit tests
├── initialData/            # Scripts and data for initializing the database
├── template/               # Email templates
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── package.json            # Project dependencies and scripts
├── schema.sql              # Database schema
└── README.md               # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.
- `POST /api/auth/resetLink`: Send a password reset link.
- `POST /api/auth/resetPassword`: Reset the user's password.

### User Management
- `GET /api/user`: Get all users (Admin only).
- `GET /api/user/:id`: Get a specific user.
- `PUT /api/user/:id`: Update user details.
- `DELETE /api/user/:id`: Delete a user.

### Movie Management
- `POST /api/movie`: Add a new movie (Admin only).
- `GET /api/movie`: Get all movies.
- `GET /api/movie/:id`: Get details of a specific movie.
- `PUT /api/movie/:id`: Update movie details (Admin only).
- `DELETE /api/movie/:id`: Delete a movie (Admin only).

### Review Management
- `POST /api/review`: Add a review for a movie.
- `GET /api/review/:movieId`: Get all reviews for a movie.
- `PUT /api/review/:id`: Update a review.
- `DELETE /api/review/:id`: Delete a review.

### File Upload
- `POST /upload`: Upload a file (e.g., movie poster).

## Testing

Unit tests are written using Jest and Supertest. To run the tests:
```bash
npm test
```

## Docker Deployment

To deploy the application using Docker:
1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
2. Access the application at `http://localhost:8081`.

## Author

Vinay Billa
