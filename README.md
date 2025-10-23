# Project A Backend

Invoice generation and management system with PDF creation and AWS S3 storage.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- AWS S3 account
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/TheKingSnoop/project-a-backend.git
cd project-a-backend

2. **Install dependencies**
npm install

3. **Install Playwright browsers (REQUIRED for PDF generation)**
npm run setup
# OR run the full setup (installs deps + browsers)
npm run setup:full

4. **Start development server**
npm run dev 
# OR
npm start 

📜 Available Scripts
npm run dev - Start development server with nodemon
npm start - Start production server
npm run setup - Install Playwright browsers
npm run setup:full - Install dependencies + Playwright browsers
🐳 Docker Deployment
The application is configured for Docker deployment on Render.com. The Dockerfile automatically handles Playwright browser installation in production.

🔧 Development Notes
PDF Generation
Uses Playwright with Chromium for PDF generation
Requires npx playwright install chromium for local development
PDFs are automatically uploaded to AWS S3
Database
MongoDB with embedded invoice documents in user records
Automatic cleanup of S3 files when invoices are deleted
Authentication
JWT-based authentication with middleware protection
Routes can be protected using the checkAuth middleware

📦 Tech Stack
Runtime: Node.js 18+
Framework: Express.js
Database: MongoDB with Mongoose
PDF Generation: Playwright
File Storage: AWS S3
Authentication: JWT
Deployment: Docker on Render.com