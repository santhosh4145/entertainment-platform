# 🎵 Entertainment Platform

A full-stack entertainment and live events platform built with React, FastAPI, and PostgreSQL. Features ticket purchasing, artist roster management, merch shop with Stripe payments, and a full admin dashboard.

---

## 🚀 Features

- **Live Events** — Browse and purchase tickets for upcoming events
- **Artist Roster** — Explore artists with genre filtering and profiles
- **Merch Shop** — Full e-commerce with cart and Stripe checkout
- **User Auth** — Register, login, JWT-based sessions
- **My Tickets** — View all purchased tickets in one place
- **Admin Dashboard** — Manage events, artists, users, and view revenue stats
- **Protected Routes** — Role-based access (user vs admin)

---

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- shadcn/ui
- Zustand (state management)
- React Router v6
- Axios

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL
- JWT Authentication (python-jose)
- bcrypt password hashing
- Stripe Payments API

### Infrastructure
- Docker + Docker Compose (local PostgreSQL)
- Uvicorn ASGI server

---

## 📦 Project Structure

```
entertainment-platform/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # UI components
│   │   └── store/          # Zustand stores
│   └── package.json
├── backend/                # FastAPI app
│   ├── app/
│   │   ├── routes/         # API route handlers
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # JWT utilities
│   │   └── main.py         # App entry point
│   └── requirements.txt
└── docker-compose.yml      # PostgreSQL container
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- Python 3.11+
- Docker Desktop

### 1. Clone the repo
```bash
git clone https://github.com/santhosh4145/entertainment-platform.git
cd entertainment-platform
```

### 2. Start the database
```bash
docker compose up -d
```

### 3. Set up the backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1   # Windows
pip install -r requirements.txt
```

Create a `.env` file in `/backend`:
```
DATABASE_URL=postgresql://hotbox:underground@localhost:5433/hotboxdb
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

### 4. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 💳 Stripe Test Payments

Use these test card details in checkout:
- **Card:** `4242 4242 4242 4242`
- **Expiry:** Any future date
- **CVC:** Any 3 digits

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |

### Frontend (`frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login + get JWT |
| GET | `/events` | List all events |
| GET | `/events/:id` | Get single event |
| POST | `/tickets/` | Purchase ticket |
| GET | `/tickets/mine` | Get my tickets |
| GET | `/merch/` | List merch items |
| POST | `/create-checkout-session` | Stripe checkout |
| GET | `/admin/stats` | Admin dashboard stats |

---

## 🧑‍💻 Author

Built by [Santhosh](https://github.com/santhosh4145)

---

## 📄 License

MIT
