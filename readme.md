# ReadWrite DS - Quiz App

## Overview
Simple quiz app built with React (Vite + TS), Zustand, Express (TS), PostgreSQL. Features:
- Register/Login (JWT)
- Questions CRUD (protected)
- Quiz section with timer
- Results page

## Links to frontend:
https://read-write-delta.vercel.app

## Links to backend:
https://readwrite-backend.onrender.com/api


## Quickstart (local)

### Backend
1. cd server
2. add .env to server folder
3. npm install
4. Run DB migrations and seed (in your terminal):
   - psql $DATABASE_URL -f db/schema.sql
   - psql $DATABASE_URL -f db/seed_questions.sql
5. npm run dev
   Backend runs on http://localhost:4000

### Frontend
1. cd frontend
2. npm install
3. Create `.env` with `VITE_API_URL=http://localhost:4000/api`
4. npm run dev
   Frontend runs on http://localhost:5173

## Deployment
- Frontend: Deployed on Vercel 
- Backend: Deployed on Render 
- Database: Deployed on Neon 

## Demo credentials
- Email: demo@readwriteds.com
- Password: Demo1234


