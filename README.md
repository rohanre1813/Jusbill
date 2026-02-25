# JusBill

A modern, full-stack invoicing and inventory management solution designed for small to medium-sized businesses. Features elegant UI, real-time analytics, and automated PDF generation.

## 🚀 Features

- **Smart Invoicing**: Create, print, and email professional invoices in seconds.
- **Inventory Management**: Real-time stock tracking with automated updates from sales and purchases.
- **Business Analytics**: Comprehensive sales reports and product performance metrics with interactive charts.
- **Public Shop Profile**: Share your inventory with customers via a dedicated public URL.
- **Multi-Theme Support**: Sleek, responsive design with dark and light modes.
- **Secure Authentication**: JWT-based session management with secure cookies.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Redis (Upstash).
- **Communication**: Mailjet (Email), Cloudinary (Images).
- **Deployment**: Docker, Docker Compose, Nginx.

## 📦 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (for local development)

### Environment Setup

1. Clone the repository.
2. Copy `.env.example` to `.env` in the root directory.
3. Fill in the required environment variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for signing tokens.
   - `CLOUDINARY_*`: Your Cloudinary credentials for image storage.
   - `MAILJET_API_KEY` & `MAILJET_SECRET_KEY`: Credentials from Mailjet for sending emails.
   - `FROM_EMAIL`: Your verified sender email address on Mailjet.
   - `UPSTASH_REDIS_*`: Redis credentials for caching.

### Running with Docker

The easiest way to get started is using Docker Compose.

#### Development Mode
Runs with hot-reloading for both frontend and backend.
```bash
docker compose --profile dev up --build
```

#### Production Mode
Optimized builds for performance and security.
```bash
docker compose --profile prod up --build
```

## 🏗️ Project Structure

```text
├── backend/            # Express.js API
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Database schemas
│   │   ├── routes/      # API endpoints
│   │   └── middleware/  # Auth & security
├── frontend/           # React SPA
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable UI items
│   │   └── context/     # State management
└── docker-compose.yml  # Orchestration
```

## 📄 License

This project is licensed under the MIT License.
