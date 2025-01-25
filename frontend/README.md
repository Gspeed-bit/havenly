# Havenly - Property Listing Platform

![Havenly](https://your-image-url.com) <!-- Replace with an actual banner image if available -->

## Overview
Havenly is a modern real estate platform that allows users to **browse, filter, and inquire about properties**. Admins can manage listings, respond to inquiries, and analyze user engagement through a dashboard.

## Features

### User Features
✅ Browse property listings  
✅ Filter & search properties  
✅ View detailed property pages  
✅ Save favorite properties (authentication required)  
✅ Send inquiries to agents  

### Admin Features
🔹 Manage property listings (CRUD operations)  
🔹 View & respond to user inquiries  
🔹 Track property analytics (views, saves, inquiries)  

### Authentication & Security
🔐 User authentication with email verification  
🔑 JWT-based authentication  
🛡️ Data encryption & secure API requests  

---

## Tech Stack

### Frontend
- **Next.js** (React Framework)  
- **TypeScript**  
- **Tailwind CSS**  
- **Zustand** (State management)  

### Backend
- **Node.js** (Express.js)  
- **MongoDB & Mongoose**  
- **JWT Authentication**  
- **Nodemailer** (Email verification)  

### Hosting & Deployment
- **Frontend:** Vercel  
- **Backend:** Render (Hosted at: [https://havenly-chdr.onrender.com](https://havenly-chdr.onrender.com))  
- **Database:** MongoDB Atlas  

---

## Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/havenly.git
cd havenly
```

### 2️⃣ Backend Setup
Navigate to the `backend` folder and install dependencies:  
```sh
cd backend
npm install
```
Create a **.env** file in the backend folder and add:  
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
ADMIN_CODE=Heaven
JWT_SECRET=your_secret_key
```
Run the backend server:  
```sh
npm run dev
```

### 3️⃣ Frontend Setup
Navigate to the `frontend` folder and install dependencies:  
```sh
cd ../frontend
npm install
```
Run the Next.js development server:  
```sh
npm run dev
```
The frontend will be available at **http://localhost:3000**.  

---

## API Endpoints

### Authentication
🔹 `POST /api/auth/register` – Register a user  
🔹 `POST /api/auth/login` – Login a user  
🔹 `POST /api/auth/verify` – Verify email  
🔹 `GET /user/me` – Get user profile  

### Properties
🏠 `GET /api/properties` – Fetch all listings  
🏠 `POST /api/properties/save` – Save a property  
🏠 `GET /api/properties/saved` – Get saved properties  

### Admin Analytics
📊 `GET /api/analytics/properties` – Property engagement stats  
📊 `GET /api/analytics/users` – User activity stats  
📊 `GET /api/analytics/inquiries` – Inquiry stats  

---

## Project Structure
```
Havenly/
│── backend/      # Backend (Node.js, Express, MongoDB)
│── frontend/     # Frontend (Next.js, TypeScript, Tailwind CSS)
│── .gitignore    # Ignore sensitive files
│── README.md     # Project documentation
│── package.json  # Dependencies
```

---

## Contributing
🚀 Contributions are welcome! Feel free to fork the repo, submit issues, and create pull requests.  

---

