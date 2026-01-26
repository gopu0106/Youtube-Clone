# YouTube Clone MERN Project

This is a complete YouTube Clone Capstone Project built using the MERN stack.

## Tech Stack

- **Frontend**: React, Vite, Axios, Lucide React, React Router Dom
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- **Styling**: Vanilla CSS

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. Clone the repository
2. **Backend**:
   - `cd backend`
   - `npm install`
   - Create a `.env` file with `PORT`, `MONGODB_URI`, and `JWT_SECRET`
   - `npm run dev`
3. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Features

- User Authentication (Signup/Login) with JWT
- Video discovery with search and category filters
- Dedicated video player with views count and like/dislike (UI)
- Full Comment system (Add, View)
- Channel Studio for uploading and deleting videos
- Fully responsive design
