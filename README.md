# Polling App

This is a full-stack polling application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to create and participate in polls, with features like anonymous voting, and image processing for optimized display.

## Key Features

- **User Authentication**: Secure user registration and login for authenticated access.
- **CRUD Operations**: Create, view, update, and delete polls for logged-in users.
- **Anonymous Voting**: Non-logged-in users can vote, while only authenticated users can create or edit polls.
- **Poll Structure**: Each poll includes one image and a minimum of two and a maximum of five voting options.
- **Image Processing**: Poll images are optimized using an image optimization API, displaying the before and after sizes to users.

## Project Structure

The project has two main folders:

- **backend**: Contains server-side code using Node.js, Express, and MongoDB.
- **frontend**: Contains client-side code using React.js.

## Setup Instructions

To set up and run this project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/naquiyaa/PollingApp.git
cd PollingApp
```

### 2. Backend Setup

To run the backend:

1. Navigate to the `backend` directory.

    ```bash
    cd backend
    ```

2. Install dependencies using npm:

    ```bash
    npm install
    ```

3. Run the backend server in development mode:

    ```bash
    npm run dev
    ```

   The server will be running at `http://localhost:5000` (or another port if specified in your `.env` file).

   **Required Environment Variables:**
   - `MONGO_URI`: MongoDB connection URI.
   - `JWT_SECRET`: Secret key for JSON Web Token (JWT) authentication.
   - `TINY_PNG_API_KEY`: API key for the image optimization service (TinyPNG).
   - `PORT`: 5000

### 3. Frontend Setup

To run the frontend:

1. Navigate to the `frontend` directory.

    ```bash
    cd frontend
    ```

2. Install dependencies using npm:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm start
    ```

   The frontend will be accessible at `http://localhost:3000` (or another port if specified).

