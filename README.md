# 🚀 JusBill

A modern, full-stack invoicing and inventory management solution designed for small to medium-sized businesses. Features an elegant UI, real-time analytics, and automated PDF generation.

---

## ✨ Features

- **📊 Smart Invoicing**: Create, print, and email professional invoices in seconds.
- **📦 Inventory Management**: Real-time stock tracking with automated updates from sales and purchases.
- **📈 Business Analytics**: Comprehensive sales reports and product performance metrics with interactive charts.
- **🏪 Public Shop Profile**: Share your inventory with customers via a dedicated public URL.
- **🎨 Multi-Theme Support**: Sleek, responsive design with beautiful dark and light modes.
- **🔒 Secure Authentication**: JWT-based session management with secure cookies and OTP verification.
- **📱 Responsive UI**: Fully optimized for mobile, tablet, and desktop views.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (using Mongoose)
- **Email Service**: [Mailjet](https://www.mailjet.com/)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)

### Deployment & Infrastructure
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose
- **Proxy**: Nginx

## 📦 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (for local development)

### Environment Setup
1. Clone the repository.
2. Create a `.env` file in the root directory and copy content from `.env.example`.
3. Fill in the required environment variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for signing tokens.
   - `CLOUDINARY_*`: Your Cloudinary credentials for image storage.
   - `MAILJET_API_KEY` & `MAILJET_SECRET_KEY`: Credentials from Mailjet for sending emails.
   - `FROM_EMAIL`: Your verified sender email address on Mailjet.

### Running the Application

The easiest way to get started is using Docker Compose.

#### 🛠️ Local Development
Runs with hot-reloading for both frontend and backend.
```bash
docker compose --profile dev up --build
```

#### 🚀 Production Build
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
│   │   ├── components/  # Reusable UI items
│   │   ├── pages/       # Page components
│   │   ├── context/     # State management
│   │   └── api/         # API service layers
└── docker-compose.yml  # Orchestration
```

## 📄 License

This project is licensed under the MIT License.
