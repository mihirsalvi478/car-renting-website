# CarRenting Website

A full-stack car rental and tour package booking application built with React, Express.js, and PostgreSQL.

## What Does This Project Do?

This web app lets users:

- **Browse & rent cars** — economy, premium, and luxury categories
- **Explore tour packages** — curated travel packages across India with coupon discounts
- **Book cars** — pick dates, see pricing, and manage bookings
- **Shopping cart** — add cars or packages to a cart before booking
- **User accounts** — sign up, sign in, and view your profile & orders

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React, Vite, TypeScript             |
| Styling    | Tailwind CSS                        |
| Animations | Framer Motion                       |
| Backend    | Express.js, TypeScript              |
| Database   | PostgreSQL (Neon serverless)        |
| ORM        | Prisma                              |
| Auth       | JWT + bcryptjs                      |
| Validation | Zod                                 |
| Payment    | Razorpay (integration scaffolded)   |

## Project Structure

```
CarRenting-website/
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # Route pages (Home, Cars, Packages, Bookings, etc.)
│       ├── components/# Reusable UI components (Appbar, Footer, Hero, etc.)
│       ├── lib/       # Config (backend URL)
│       └── types/     # TypeScript interfaces
│
└── backend/           # Express.js API server
    ├── prisma/        # Database schema & seed file
    └── src/
        ├── controllers/  # Route handlers (auth, cars, packages, bookings)
        ├── routes/       # API route definitions
        ├── middleware/   # JWT auth middleware
        ├── models/       # Zod validation schemas
        ├── db/           # Prisma client setup
        └── utils/        # Helpers (validation, Razorpay)
```

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A PostgreSQL database (you can use [Neon](https://neon.tech/) for a free serverless one)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CarRenting-website.git
cd CarRenting-website
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=any_secret_string_you_want
PORT=3001
```

> Replace `your_postgresql_connection_string` with your actual PostgreSQL URL.
> For `JWT_SECRET`, use any random string (e.g. `mysupersecretkey123`).

Now set up the database:

```bash
npm run db:generate    # generates the Prisma client
npm run db:migrate     # creates the database tables
npm run db:seed        # fills the database with sample cars & packages
```

Start the backend server:

```bash
npm run dev
```

The backend will run at `http://localhost:3001`.

### 3. Set up the frontend

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`. Open this URL in your browser.

## API Endpoints

### Auth

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/auth/signup`       | Register new user |
| POST   | `/auth/signin`       | Login user        |

### Cars

| Method | Endpoint     | Description          |
| ------ | ------------ | -------------------- |
| GET    | `/cars`      | Get all cars         |
| GET    | `/cars/:id`  | Get car details      |

### Tour Packages

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/packages`      | Get all packages      |
| GET    | `/packages/:id`  | Get package details   |

### Bookings (requires login)

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| POST   | `/bookings`     | Create a booking   |
| GET    | `/bookings`     | Get your bookings  |
| GET    | `/bookings/:id` | Get booking by ID  |
| PUT    | `/bookings/:id` | Update a booking   |
| DELETE | `/bookings/:id` | Delete a booking   |

### Cart

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | `/user/cart/add`   | Add item to cart     |
| POST   | `/user/cart/remove`| Remove from cart     |
| GET    | `/user/cart`       | View your cart       |

## Database Schema

The app uses 5 main tables:

- **Users** — name, email, password (hashed)
- **Cars** — name, type (economy/premium/luxury), price, description, image
- **Packages** — name, price, destinations list, coupon code, image
- **Bookings** — links a user to a car with dates, price, and status
- **CartItems** — links a user to a car or package they want to book

## Available Scripts

### Backend (`cd backend`)

| Command              | What it does                         |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Build and start the server           |
| `npm run build`      | Compile TypeScript to JavaScript     |
| `npm start`          | Start the compiled server            |
| `npm run db:generate`| Generate Prisma client               |
| `npm run db:migrate` | Run database migrations              |
| `npm run db:seed`    | Seed database with sample data       |
| `npm run db:studio`  | Open Prisma Studio (visual DB editor)|

### Frontend (`cd frontend`)

| Command            | What it does                     |
| ------------------ | -------------------------------- |
| `npm run dev`      | Start development server         |
| `npm run build`    | Build for production             |
| `npm run preview`  | Preview production build locally |
| `npm run lint`     | Run ESLint to check code quality |

## How Authentication Works

1. User signs up with name, email, and password
2. Password is hashed using bcrypt before storing in the database
3. On sign in, a JWT token is generated (valid for 1 hour)
4. The token is sent in the `token` header for protected API requests
5. The auth middleware verifies the token before allowing access

## Troubleshooting

**Backend won't start?**
- Make sure your `.env` file exists in `backend/` with all required variables
- Run `npm run db:generate` before starting the server

**Database errors?**
- Check if your `DATABASE_URL` is correct and the database is accessible
- Run `npm run db:migrate` to create/update tables

**Frontend can't connect to backend?**
- Make sure the backend is running first
- Check `frontend/src/lib/config.ts` — the backend URL should match your backend's port
