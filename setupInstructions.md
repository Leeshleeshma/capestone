## ⚙️ Setup Instructions
 
This project consists of **two repositories**:
 
- **Frontend (React + Vite)**  
    https://github.com/Leeshleeshma/capestone
 
- **Backend (Express + MongoDB + Clerk)**  
    https://github.com/Leeshleeshma/Backend-capestone
 
Both repositories support **Dev Containers** to ensure the project runs on another machine without manual configuration.
 
---
 
## 🧰 Prerequisites
 
Make sure the following are installed on your system:
 
- **Git**
- **Docker Desktop**
- **Visual Studio Code**
- **VS Code Extensions**
  - Dev Containers
- **Node.js** (only if not using Dev Containers)
- A **Clerk account**
- A **MongoDB Atlas account**
- A **Google Cloud account** (for deployment)
 
---
 
## 🐳 Option 1: Run Using Dev Containers (Recommended)
 
This is the **preferred setup** for grading and collaboration.
 
### Frontend Setup (Dev Container)
 
1. Clone the frontend repository:
   git clone https://github.com/Leeshleeshma/capestone.git
 
2. Open the project in VS Code

3. When prompted, select: `Reopen in Container`
 
4. Create a .env file inside the frontend root:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE=https://<cloud-run-backend-url>
```
 
5. Start the frontend:
```
npm install
npm run dev
```
 
Frontend will be available at: `http://localhost:5173`
 
---
 
## Backend Setup (Dev Container)
 
1. Clone the backend repository:

git clone https://github.com/Leeshleeshma/Backend-capestone.git
 
2. Open the project in VS Code
 
3. Reopen in Dev Container when prompted.

4. Create a account in TMDB API and Watchmode API to get TMDB URL, TMDB Token and Watchmode API Key.
 
4. Create a .env file inside the backend root:
```
PORT=8080
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
TMDB_Token=your_tmdb_token
TMDB_URL=your_tmdb_url
apikey=watchmode_apikey
FRONTEND_URL=http://localhost:5173
```
 
4. Start the backend:
```
npm install
npm run dev --prefix backend
```
 
Backend will be available at: `http://localhost:8080`
 
---
 
## Movies check:
 
GET  `http://localhost:8080/Movies`
 
---
 
🔐 Clerk Authentication Setup
 
Create a Clerk application at:
 
`https://dashboard.clerk.com`
 
Enable Google OAuth in Clerk dashboard.
 
Copy: - Publishable Key → frontend .env
 
Configure allowed origins: `http://localhost:5173`
 
🧪 Running Automated Tests
 
Frontend includes Playwright end-to-end tests.
```
npx playwright install
npx playwright test
npx playwright show-report --host 0.0.0.0
```
 
Test coverage includes:
 
- Landing page rendering
 
## ☁️ Deployment (Summary)
Backend (Google Cloud Run)
Frontend (Firebase Hosting)