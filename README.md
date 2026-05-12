# Nairobi Celtics FC — Official Website

Full-scale MERN web application for Nairobi Celtics FC, a premier football club competing in the Kenyan Premier League.

## Tech Stack

- **Frontend:** React 18 + Vite, Tailwind CSS, Framer Motion, Zustand
- **Backend:** Node.js + Express.js, JWT auth, MVC architecture
- **Database:** MongoDB + Mongoose (Atlas or local)
- **Payments:** M-Pesa STK Push simulation, card processing

## Setup

### Prerequisites

- Node.js 20+
- MongoDB (Atlas or local)
- npm or yarn

### Environment

```bash
cp .env.example server/.env
# Edit server/.env with your values
```

### Install & Run

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Seed the database
cd ../server && node seed/seedAll.js

# Run both (from root)
# Terminal 1:
cd server && npm run dev
# Terminal 2:
cd client && npm run dev
```

### Scripts

| Script | Description |
|--------|-------------|
| `server/npm run dev` | Start Express with nodemon |
| `server/npm start` | Start Express production |
| `client/npm run dev` | Start Vite dev server |
| `client/npm run build` | Build for production |
| `node server/seed/seedAll.js` | Seed all collections |

## API Endpoints

All endpoints prefixed with `/api/`. See full list in `server/routes/`.

## Brand

- Primary: `#00C853` (Celtics Green)
- Secondary: `#0A0A0A` (Deep Black)
- Accent: `#FFFFFF`, `#FFD700` (Gold, elite only)
- Fonts: Bebas Neue (display), DM Sans (body)

## Project Structure

```
nairobi-celtics-fc/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route pages
│   │   ├── store/       # Zustand state
│   │   ├── services/    # API services
│   │   └── utils/       # Helpers
│   └── public/images/   # Static images
├── server/          # Express backend
│   ├── models/      # Mongoose schemas
│   ├── controllers/ # Route handlers
│   ├── routes/      # API endpoints
│   ├── middleware/  # Auth, error handling
│   ├── services/    # M-Pesa, email, PDF
│   └── seed/        # Database seed scripts
└── README.md
```
