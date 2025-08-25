# UP-load

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=FFF&style=flat-square)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-red)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)](https://jwt.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

## Description

**UP-load** is a secure and modern full-stack web application that allows authenticated users to upload, store, manage, and share files via public and private links. It solves the problem of managing personal cloud storage with fine-grained access control and token-based security.

The project combines a powerful Express.js backend with JWT-based authentication and a responsive React frontend, making file handling seamless, efficient, and secure. It supports real-time token refresh, file previewing, download tracking, and user-based file isolation.

### Key Functionalities

- 🔐 User authentication with JWT and refresh tokens
- 📂 File uploads with public/private visibility
- 🔗 Sharable file links with access control
- 📈 Download statistics tracking
- 🧾 Real-time preview and file detail management
- 🧪 Robust validation with Zod
- ☁️ RESTful API with protected and public routes

## Features

### 🔐 Authentication & Security

- **JWT Authentication with Refresh Tokens**

  - Access tokens stored in memory; refresh tokens in secure HTTP-only cookies
  - Automatic access token renewal via API interceptor

- **Private and Public File Access**
  - Files uploaded to user-specific directories
  - Access middleware ensures proper authorization

### 📁 File Management

- **Upload, Preview, Download**

  - Files stored with `multer` in `uploads/user_{id}` folders
  - MIME-type based rendering for preview

- **File Metadata & Analytics**
  - Tracks upload time, downloads, size, original filename
  - `mongoose` schema enforces structure and integrity

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: Version 18 or higher (LTS recommended).
- **npm** or **Yarn**: For package management.
- **MongoDB**: A running instance (local or cloud-hosted, e.g., MongoDB Atlas).

### Step-by-step Setup Instructions

**1. Clone the repository:**

```bash
git clone https://github.com/dmknpd/up-load.git
cd UP-load
```

**2. Backend Setup:**

- Navigate into the backend directory and install backend dependencies:

```bash
cd server
npm install
```

- Create a .env file in the backend directory. Populate it with your environment variables:

```bash
# Database
MONGO_URI=your_mongo_uri # Replace with your MongoDB connection string

# JWT
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

# App
HOST=http://localhost
PORT=5000

#Frontend
FRONTEND_HOST=http://localhost
FRONTEND_PORT=3000

#ENV
NODE_ENV="dev"
```

- Start the backend server:

```bash
npm run start
```

- The backend server will run on `http://localhost:5000` (or your specified PORT)

**3. Frontend Setup:**

- Open a new terminal session and navigate to the frontend directory and install frontend dependencies:

```bash
cd ../client
npm install
```

- Create a .env file in the backend directory. Populate it with your environment variables:

```bash
# App
REACT_APP_HOST=http://localhost
REACT_APP_PORT=3000

#Backend
REACT_APP_BACKEND_HOST=http://localhost
REACT_APP_BACKEND_PORT=5000
```

- Start the frontend development server:

```bash
npm run start
```

- The frontend application will typically open in your default browser at `http://localhost:3000`

## Usage

- 📌 Register a new user or log in with existing credentials.
- 📤 Upload files by drag & drop or clicking the upload area.
- 📂 View your files and public files on separate pages.
- 📝 Click on a file to see details, download it, or edit metadata.
- 🔒 Toggle file privacy to share files publicly or keep them private.
- 🚪 Use the logout button to end the session securely.

## API Endpoints

#### Base URL: http://localhost:5000/api

### Authentication (Auth)

- **POST `/auth/register`**

  Registers a new user in the system.

  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword123",
      "confirmPassword": "yourpassword123"
    }
    ```

  * **Successful Response (`201 Created`):**

    ```json
    {
      "message": "User registered successfully"
    }
    ```

  * **Error Responses:**

    - **`400 Bad Request`** (Email already used)

      ```json
      {
        "errors": {
          "email": ["Email already used"]
        }
      }
      ```

    - **`500 Internal Server Error`**

      ```json
      {
        "message": "Registration error"
      }
      ```

- **POST `/auth/login`**

  Authenticates a user, returns an access token, and sets a `refreshToken` in an `httpOnly` cookie.

  - **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword123"
    }
    ```

  - **Successful Response (`200 OK`):**

    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

  - **Error Responses:**

    - **`400 Bad Request`** (Invalid credentials)

      ```json
      {
        "errors": {
          "email": ["User doesn't exist or wrong password"]
        }
      }
      ```

    - **`500 Internal Server Error`**

      ```json
      {
        "message": "Login error"
      }
      ```

- **GET `/auth/refresh`**

  Refreshes the access and refresh token pair. Requires a valid `jwt` refresh token in the cookies.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new..."
    }
    ```

  - **Error Responses:**

    - **`401 Unauthorized`** (Token is missing or invalid)

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`403 Forbidden`** (Access denied)

      ```json
      {
        "message": "Access denied"
      }
      ```

- **GET `/auth/logout`**

  Logs the user out by deleting the `refreshToken` from the database and clearing the cookie.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "message": "Logged out successfully"
    }
    ```

  - **Successful Response (`204 No Content`):**
    Returned if the user was not authenticated (`jwt` cookie was absent).

  - **Error Responses:**

    - **`500 Internal Server Error`**

      ```json
      {
        "message": "Logout error: "
      }
      ```

### Files

#### **Public Routes**

- **GET `/files/public`**

  Returns a list of all public files.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "files": [
        {
          "_id": "60c72b2f9b1d8e001f8e4b1a",
          "filename": "1623665455-123456789.jpg",
          "originalname": "public_photo.jpg",
          "path": "/uploads/user_.../1623665455-123456789.jpg",
          "mimetype": "image/jpeg",
          "size": 102400,
          "isPublic": true,
          "downloads": 15,
          "createdAt": "2025-07-31T10:00:00.000Z",
          "updatedAt": "2025-07-31T10:00:00.000Z"
        }
      ]
    }
    ```

  - **Error Responses:**

    - **`500 Internal Server Error`**

      ```json
      {
        "message": "Error receiving  file"
      }
      ```

- **GET `/files/public/:id`**

  Returns metadata for a single public file by its ID.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "file": {
        "_id": "60c72b2f9b1d8e001f8e4b1a",
        "user": "60c72a0f9b1d8e001f8e4b19",
        "filename": "1623665455-123456789.jpg",
        "originalname": "public_photo.jpg",
        "path": "/uploads/user_.../1623665455-123456789.jpg",
        "mimetype": "image/jpeg",
        "size": 102400,
        "isPublic": true,
        "downloads": 15,
        "createdAt": "2025-07-31T10:00:00.000Z",
        "updatedAt": "2025-07-31T10:00:00.000Z"
      }
    }
    ```

  - **Error Responses:**

    - **`403 Forbidden`** (File is not public)

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**

      ```json
      {
        "message": "File not found"
      }
      ```

- **GET `/files/public/preview/:id`**

  Serves the file itself (e.g., an image) for preview if it is public.

  - **Successful Response (`200 OK`):**
    The response body contains the binary data of the file.

  - **Error Responses:**

    - **`403 Forbidden`** (File is not public)

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**

      ```json
      {
        "message": "File not found"
      }
      ```

- **GET `/files/public/download/:id`**

  Serves the file for download if it is public and increments the download counter.

  - **Successful Response (`200 OK`):**
    The response body contains the binary data of the file.

  - **Error Responses:**

    - **`403 Forbidden`** (File is not public)

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**

      ```json
      {
        "message": "File not found"
      }
      ```

#### **Private Routes (Authentication Required)**

- **POST `/files/upload`**

  Uploads a file for the authenticated user. Requires a `multipart/form-data` request with a `file` field.

  - **Constraints:** Images only (`image/*`), max size 5MB.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "message": "File uploaded successfully",
      "file": {
        "_id": "60c72b2f9b1d8e001f8e4b1b",
        "user": "60c72a0f9b1d8e001f8e4b19",
        "filename": "1623665456-987654321.png",
        "originalname": "my_private_image.png",
        "path": "/uploads/user_.../1623665456-987654321.png",
        "mimetype": "image/png",
        "size": 204800,
        "isPublic": false,
        "downloads": 0,
        "createdAt": "2025-07-31T11:00:00.000Z",
        "updatedAt": "2025-07-31T11:00:00.000Z"
      }
    }
    ```

  - **Error Responses:**

    - **`400 Bad Request`** (No file was uploaded or wrong file type)

      ```json
      {
        "message": "No file uploaded"
      }
      ```

    - **`401 Unauthorized`** (Authentication required)

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`500 Internal Server Error`**

      ```json
      {
        "message": "Error saving file"
      }
      ```

- **GET `/files/user`**

  Returns a list of all files belonging to the authenticated user.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "files": [
        {
          "_id": "60c72b2f9b1d8e001f8e4b1b",
          "filename": "1623665456-987654321.png",
          "originalname": "my_private_image.png",
          "path": "/uploads/user_.../1623665456-987654321.png",
          "mimetype": "image/png",
          "size": 204800,
          "isPublic": false,
          "downloads": 0,
          "createdAt": "2025-07-31T11:00:00.000Z",
          "updatedAt": "2025-07-31T11:00:00.000Z"
        }
      ]
    }
    ```

  - **Error Responses:**

    - **`401 Unauthorized`**

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`500 Internal Server Error`**

      ```json
      {
        "message": "Error receiving  file"
      }
      ```

- **GET `/files/:id`**

  Returns metadata for a single file by ID if it belongs to the user.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "file": {
        "_id": "60c72b2f9b1d8e001f8e4b1b",
        "user": "60c72a0f9b1d8e001f8e4b19",
        "filename": "1623665456-987654321.png",
        "originalname": "my_private_image.png",
        "path": "/uploads/user_.../1623665456-987654321.png",
        "mimetype": "image/png",
        "size": 204800,
        "isPublic": false,
        "downloads": 0,
        "createdAt": "2025-07-31T11:00:00.000Z",
        "updatedAt": "2025-07-31T11:00:00.000Z"
      }
    }
    ```

  - **Error Responses:**

    - **`401 Unauthorized`**

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`403 Forbidden`** (File does not belong to the user)

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**
      ```json
      {
        "message": "File not found"
      }
      ```

- **GET `/files/preview/:id`**

  Serves a file for preview if it belongs to the user.

  - **Successful Response (`200 OK`):**
    The response body contains the binary data of the file.

  - **Error Responses:**

    - **`401 Unauthorized`**

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`403 Forbidden`** (File does not belong to the user)

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**
      ```json
      {
        "message": "File not found"
      }
      ```

- **GET `/files/download/:id`**

  Serves a file for download if it belongs to the user and increments the download counter.

  - **Successful Response (`200 OK`):**
    The response body contains the binary data of the file.

  - **Error Responses:**

    - **`401 Unauthorized`**

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`403 Forbidden`** (File does not belong to the user)

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**
      ```json
      {
        "message": "File not found"
      }
      ```

- **PATCH `/files/update/:id`**

  Updates file properties (e.g., `isPublic` or `originalname`).

  - **Request Body:**

    ```json
    {
      "isPublic": true,
      "originalname": "new_public_name.png"
    }
    ```

  - **Successful Response (`200 OK`):**

    ```json
    {
      "file": {
        "_id": "60c72b2f9b1d8e001f8e4b1b",
        "user": "60c72a0f9b1d8e001f8e4b19",
        "filename": "1623665456-987654321.png",
        "originalname": "new_public_name.png",
        "path": "/uploads/user_.../1623665456-987654321.png",
        "mimetype": "image/png",
        "size": 204800,
        "isPublic": true,
        "downloads": 0,
        "createdAt": "2025-07-31T11:00:00.000Z",
        "updatedAt": "2025-07-31T11:05:00.000Z",
        "__v": 1
      }
    }
    ```

  - **Error Responses:**

    - **`401 Unauthorized`**

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`403 Forbidden`**

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**

      ```json
      {
        "message": "File not found"
      }
      ```

    - **`500 Internal Server Error`**

      ```json
      {
        "errors": {
          "file": ["Error updating file"]
        }
      }
      ```

- **DELETE `/files/delete/:id`**

  Deletes the file and its associated document from the database.

  - **Successful Response (`200 OK`):**

    ```json
    {
      "message": "File deleted successfully"
    }
    ```

  - **Error Responses:**

    - **`401 Unauthorized`**

      ```json
      {
        "message": "Please login to continue"
      }
      ```

    - **`403 Forbidden`**

      ```json
      {
        "message": "Access denied"
      }
      ```

    - **`404 Not Found`**

      ```json
      {
        "message": "File not found"
      }
      ```

    - **`500 Internal Server Error`**

      ```json
      {
        "errors": {
          "file": ["Error deleting file"]
        }
      }
      ```

## Project Structure

### The project is logically separated into backend (Node.js/Express) and frontend (React), facilitating independent development and deployment.

```bash
.
├── backend/                  # Express backend server
│   ├── controllers/         # Business logic for auth and file operations
│   ├── middlewares/         # JWT authentication, validation, file upload handling
│   ├── models/              # Mongoose schemas: User, File
│   ├── routes/              # API routes for auth and file endpoints
│   ├── utils/               # JWT token utilities, helpers
│   ├── validation/          # Zod validation schemas
│   ├── config/              # Configuration constants (env variables)
│   ├── index.ts             # Entry point for backend
│   └── package.json         # Backend dependencies
├── client/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── api/             # Axios API clients for auth and file operations
│   │   ├── components/      # UI components (FileList, Upload, FileDetails, UserFileList, etc.)
│   │   ├── store/           # Zustand global state management
│   │   ├── types/           # TypeScript types/interfaces
│   │   ├── validation/      # Zod validation for frontend forms
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── App.tsx          # Main React component & routing
│   │   └── index.tsx        # ReactDOM render entry
│   └── package.json         # Frontend dependencies
└── README.md                # This file
```

## Dependencies

### Backend Dependencies

| Package       | Purpose                               |
| ------------- | ------------------------------------- |
| express       | Web server framework                  |
| mongoose      | MongoDB object modeling               |
| jsonwebtoken  | JWT token generation and verification |
| bcrypt        | Password hashing                      |
| multer        | File upload middleware                |
| zod           | Data validation                       |
| cookie-parser | Parsing cookies for refresh tokens    |
| dotenv        | Environment variable management       |

### Frontend Dependencies

| Package             | Purpose             |
| ------------------- | ------------------- |
| react               | UI library          |
| react-router-dom    | Client-side routing |
| axios               | HTTP client         |
| zustand             | State management    |
| zod                 | Form validation     |
| @mui/icons-material | Material UI icons   |
| tailwindcss         | Styling framework   |
