# YUVA DUTY - Full-Stack MERN Civic Initiative Website

YUVA DUTY is a premium, youth-led civic initiative and social-impact website built on the **MERN (MongoDB, Express, React, Node.js) Stack**. The application is designed to be highly polished, dark-mode first, featuring electric orange accents, smooth Framer Motion animations, and a secure admin panel.

## Features
1. **Dynamic Pages**: Responsive views including Home, About, Community, Projects Portfolio, Join Us forms, and Contact panels.
2. **Join Us Recruitment**: Validated role registration form submitting directly to MongoDB.
3. **Contact Inbox**: Connect logs viewable in the admin panel.
4. **JWT Security**: BCrypt password hashing and JSON Web Token routes protection.
5. **Admin Operations (CRUD)**: Manage statistics, volunteers registry, school partnerships, project posts, civic activities, and educational video assets.

---

## Tech Stack
- **Frontend**: React.js, Vite, React Router, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, JWT, Bcrypt.
- **Database**: MongoDB (via Mongoose ODM).

---

## Installation & Setup

Follow these steps to run the application locally.

### 1. Prerequisite
Ensure you have **Node.js** (v18+) and **MongoDB** installed and running on your local machine on port `27017` (default).

### 2. Copy Environment Template
Ensure a `.env` file exists in the `server` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/yuvaduty
JWT_SECRET=yuvaduty_jwt_secret_token_key_2026
NODE_ENV=development
```

### 3. Bootstrap Dependencies
At the root directory, run the command below to automatically install packages for the root, server, and client:
```bash
npm run bootstrap
```
*Alternatively, you can manually run `npm install` inside the root, `client/` and `server/` folders.*

### 4. Seed Administrative Data
Seed the database with initial administrative credentials and default project statistics:
```bash
npm run seed
```

This will set up the default admin credentials:
- **Email**: `admin@yuvaduty.org`
- **Password**: `admin_duty_2026`

### 5. Launch the Development Server
Launch both the Vite client and the Express backend concurrently from the root directory:
```bash
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000) and proxy requests to the backend server running on [http://localhost:5000](http://localhost:5000).

---

## Project Structure
```
Project/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/         # Static vectors (Logo)
│   │   ├── components/     # Buttons, Cards, Inputs, Toast, Nav, Footer
│   │   ├── context/        # Auth and Toast global context providers
│   │   ├── pages/          # Home, About, Community, Projects, Forms, Admin
│   │   ├── App.jsx         # Routes mappings and Protections
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express Backend API
│   ├── config/             # DB connection hooks
│   ├── controllers/        # Logical controllers (Auth, CRUD operations)
│   ├── middleware/         # Protected routes middleware
│   ├── models/             # Mongoose Schemas (User, Reg, Volunteer, School)
│   ├── routes/             # API routes definitions
│   ├── scripts/            # Database seeder scripts
│   └── server.js           # Express main listener entry
├── package.json            # Root Concurrency runner
└── README.md
```
