# ArchiVision AI

> AI-powered real estate visualization platform. Transform empty rooms into fully furnished spaces, generate architecture renders, and create cinematic video walkthroughs — in seconds.

---

## What This Platform Does

ArchiVision AI solves a real problem in real estate and architecture: empty properties are hard to sell, expensive to stage, and slow to visualize. This platform replaces physical staging and manual rendering with AI.

A real estate agent uploads a photo of an empty room. In seconds, the AI returns a fully furnished, photorealistic version in any style they choose. Architects upload floor plan sketches and get photorealistic renders. Brokers generate cinematic video walkthroughs without hiring a videographer.

---

## Features

- **AI Virtual Staging** — Upload an empty room, choose a style, get a furnished result
- **Architecture Rendering** — Turn floor plans and sketches into photorealistic renders
- **Video Walkthroughs** — Generate cinematic camera tour videos from a single image
- **Before / After Slider** — Interactive comparison of original vs AI-staged room
- **Style Selection** — Modern, Minimalist, Luxury, Scandinavian, African Contemporary, Industrial, Smart Home
- **User Dashboard** — Render history, credits remaining, project management
- **Subscription Plans** — Free, Pro, and Agency tiers with Stripe payments
- **Role-Based Access** — Admin, broker, architect, and client dashboards

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11 + Flask |
| Database | PostgreSQL + SQLAlchemy |
| Authentication | JWT (Flask-JWT-Extended) |
| Payments | Stripe |
| File Storage | Cloudinary |
| AI — Staging | Replicate (Stable Diffusion img2img) |
| AI — Rendering | Stability AI (ControlNet) |
| AI — Video | Runway ML Gen-3 |
| Frontend | React.js 18 + Tailwind CSS |
| HTTP Client | Axios |
| Deployment — Backend | Railway |
| Deployment — Frontend | Vercel |

---

## Project Structure

```
archivision-ai/
│
├── backend/
│   ├── app.py                  # Flask app factory and entry point
│   ├── config.py               # Environment-based configuration
│   ├── models.py               # SQLAlchemy database models
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile                # Railway deployment config
│   ├── .env.example            # Environment variable template
│   │
│   ├── auth/
│   │   └── routes.py           # Register, login, logout, JWT refresh
│   │
│   ├── renders/
│   │   └── routes.py           # Staging, rendering, video, history endpoints
│   │
│   ├── payments/
│   │   └── routes.py           # Stripe checkout, webhooks, cancel
│   │
│   ├── ai/
│   │   └── engine.py           # All AI API integrations (Replicate, Stability, Runway)
│   │
│   └── storage/
│       └── cloudinary_service.py  # Image and video upload/delete
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   │
    │   ├── components/
    │   │   ├── BeforeAfterSlider.jsx   # Interactive comparison slider
    │   │   ├── StylePicker.jsx         # Style chip selector
    │   │   ├── UploadZone.jsx          # Drag and drop image upload
    │   │   └── Navbar.jsx              # Navigation
    │   │
    │   ├── pages/
    │   │   ├── Landing.jsx             # Marketing landing page
    │   │   ├── Studio.jsx              # Main AI staging interface
    │   │   ├── Dashboard.jsx           # User dashboard and history
    │   │   ├── Pricing.jsx             # Plans and Stripe checkout
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx         # Global auth state
    │   │
    │   └── api/
    │       └── axios.js                # Axios instance with base URL and JWT headers
    │
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

Before you begin, make sure you have:

- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL installed and running
- A Cloudinary account (free tier works)
- A Replicate account and API key
- A Stability AI account and API key
- A Runway ML account and API key
- A Stripe account (test mode is fine to start)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/archivision-ai.git
cd archivision-ai
```

---

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy the environment variable template and fill in your keys:

```bash
cp .env.example .env
```

Open `.env` and add your credentials:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/archivision_db

# JWT
JWT_SECRET_KEY=your_very_long_random_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_AGENCY_PRICE_ID=price_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI APIs
REPLICATE_API_TOKEN=r8_...
STABILITY_AI_API_KEY=sk-...
RUNWAYML_API_KEY=...

# App
FRONTEND_URL=http://localhost:5173
FLASK_ENV=development
```

Create the database:

```bash
python -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all()"
```

Run the backend:

```bash
flask run
```

Backend will be running at `http://localhost:5000`

---

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend folder:

```
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Frontend will be running at `http://localhost:5173`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Login and receive JWT tokens |
| POST | `/api/auth/logout` | Invalidate token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/refresh` | Refresh access token |

### Renders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/renders/stage` | Upload room image and generate staging |
| POST | `/api/renders/architecture` | Upload floor plan and generate render |
| POST | `/api/renders/video` | Generate video walkthrough from image |
| GET | `/api/renders/history` | Get all renders for current user |
| GET | `/api/renders/:id` | Get single render details |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-checkout` | Create Stripe Checkout session |
| POST | `/api/payments/webhook` | Stripe event webhook handler |
| POST | `/api/payments/cancel` | Cancel active subscription |
| GET | `/api/payments/status` | Get current subscription status |

---

## Subscription Plans

| Feature | Free | Pro | Agency |
|---|---|---|---|
| Monthly renders | 5 | Unlimited | Unlimited |
| Virtual staging | Yes | Yes | Yes |
| Architecture renders | No | Yes | Yes |
| Video walkthroughs | No | Yes | Yes |
| Available styles | 3 | 7 | 7 |
| Team members | 1 | 1 | Up to 10 |
| White-label export | No | No | Yes |
| Price (KSh/month) | Free | 10,000 | 3,000 starter |

---

## Deployment

### Deploy backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy
railway up
```

Add all environment variables from your `.env` file in the Railway dashboard under Variables.

### Deploy frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# From the frontend folder
cd frontend
vercel

# Follow the prompts
# Set VITE_API_BASE_URL to your Railway backend URL
```

### Set up Stripe webhook

Once your backend is deployed on Railway:

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the URL to: `https://your-railway-url.railway.app/api/payments/webhook`
4. Select events: `customer.subscription.updated`, `customer.subscription.deleted`, `payment_intent.succeeded`
5. Copy the signing secret and add it as `STRIPE_WEBHOOK_SECRET` in Railway variables

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET_KEY` | Yes | Secret key for signing JWT tokens |
| `STRIPE_SECRET_KEY` | Yes | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `REPLICATE_API_TOKEN` | Yes | Replicate API token for AI staging |
| `STABILITY_AI_API_KEY` | Yes | Stability AI key for architecture renders |
| `RUNWAYML_API_KEY` | Yes | Runway ML key for video generation |
| `FRONTEND_URL` | Yes | Frontend URL for CORS whitelist |
| `FLASK_ENV` | No | `development` or `production` |

---

## Target Users

- Real estate agents and brokers
- Architects and architecture firms
- Interior designers
- Property developers
- Construction companies
- Airbnb and short-let property owners
- Furniture companies and brands

---

## Roadmap

- [x] AI virtual staging — empty room to furnished room
- [x] Style selection (7 design styles)
- [x] Before/after comparison slider
- [x] User authentication and dashboard
- [x] Stripe subscription payments
- [ ] Architecture rendering from floor plans
- [ ] AI video walkthrough generation
- [ ] Furniture marketplace — click to buy staged items
- [ ] AR/VR virtual walk-in tour (WebXR)
- [ ] White-label export for agencies
- [ ] Mobile app (React Native)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

Built by Frankline Oyiengo  
Email: oyiengofrankline49@gmail.com  


---

> ArchiVision AI — Every space, fully alive.
