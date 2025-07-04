# 🎤 CelebNetwork – Celebrity-Fan Portal

A full-stack platform where celebrities can sign up, create AI-generated profiles, and view fan engagement dashboards — while fans can follow their favorite stars.

---

## 🔐 Authentication

- JWT tokens are stored in `localStorage`.
- The frontend uses `role`, `userId`, and `token` from localStorage to route fans and celebrities to the correct dashboard.
- Celebrities sign up through an AI-assisted onboarding flow.
- Fans can follow celebrities, view profiles, and manage their own list of favorites.

---

## 📦 Setup Instructions

### ✅ Prerequisites

- Node.js v18+
- PostgreSQL
- Gemini API key from Google AI Studio

---

### ⚙️ Backend Setup

```bash
cd backend
cp .env.example .env  # Create .env file
# Fill in .env with DB credentials and Gemini key

npm install
npm run start:dev
```

---

### 🎨 Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local  # Create .env.local
# Set NEXT_PUBLIC_API_URL to your backend server URL

npm install
npm run dev
```

---

## 🌐 Environment Variables

### 🔒 `.env` (Backend)

```ini
DATABASE_URL=postgres://user:password@localhost:5432/celebdb
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_api_key

PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=write your own passwod
DB_NAME=celebnetwork


```

### 🌍 `.env.local` (Frontend)

```ini
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🧪 Testing the API

You can test the API using **Postman** or `cURL`:

### 🔸 Generate AI Celebrity Profile

```http
POST /celebrity/generateFromPrompt
Content-Type: application/json

{
  "prompt": "Indian pop singer with 2M followers"
}
```

### 🔸 Get Celebrity Dashboard Stats

```http
GET /celebrity/dashboard/:userId
Authorization: Bearer <JWT>
```

---




## 📹 videp Walkthrough

➡️ **[Watch the full 5-minute walkthrough here](https://www.loom.com/share/2173936763a64f7fbca6887658ca186f?sid=13997e79-7fc3-4fdc-9993-90ae006d739a)**  

---

## 👨‍💻 Author

- Built by **Aditya Gupta**  
- **Email**: `adiapa746103gupta@gmail.com`
