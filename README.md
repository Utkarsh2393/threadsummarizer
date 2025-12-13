🧵 Thread Analyzer (TL;DR)

Thread Analyzer is a web-based AI tool that summarizes long Reddit discussion threads into clear, concise insights using the Gemini API.
It helps users save time by extracting the essence of conversations, key viewpoints, and overall sentiment — all in seconds.

TL;DR — Get the essence, skip the noise.

🚀 Problem Statement

Online discussion platforms like Reddit contain valuable information, but important insights are often buried under hundreds of comments.
Reading entire threads is time-consuming and overwhelming.

💡 Solution

Thread Analyzer solves this problem by:

Fetching Reddit thread data

Using AI (Gemini API) to understand context

Generating:

A short summary

Key discussion points

Overall sentiment of the thread

This allows users to quickly understand what the community is saying without reading everything.

✨ Features

🔗 Paste any public Reddit thread URL

🧠 AI-generated discussion summary

📌 Key takeaways in bullet points

😊 Overall sentiment analysis (Positive / Mixed / Negative / Neutral)

🎨 Calm, modern, and responsive UI

⚡ Fast and easy to use

🛠️ Tech Stack
Frontend

HTML

CSS

JavaScript

React (Vite)

Backend

Node.js

Express.js

APIs

Gemini API – for summarization and analysis

Reddit Public JSON API – for fetching thread data

🧠 How It Works

User pastes a Reddit thread URL

Frontend sends the URL to the backend

Backend:

Fetches thread content from Reddit

Sends relevant text to Gemini API

Gemini returns:

Summary

Key insights

Sentiment

Results are displayed on the UI

📂 Project Structure
thread-analyzer/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone or Download the Repository
git clone <repository-url>


or download ZIP from GitHub and extract.

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

3️⃣ Backend Setup
cd backend
npm install


Create a .env file:

GEMINI_API_KEY=your_api_key_here


Start backend:

node server.js

🔐 API Key Note

Gemini API key is stored securely using environment variables

API keys are not exposed on the frontend

🧪 Demo Mode (Hackathon Friendly)

If live Reddit fetching fails due to network restrictions, the app can still demonstrate:

UI flow

AI summarization using sample data

🎯 Hackathon Relevance

✅ Solves a real-life problem (information overload)

✅ Strong use of Gemini API

✅ Open innovation domain

✅ Clear AI value beyond a basic chatbot

👥 Team

Team Name: Your Team Name

Members: Add names here

📌 Future Improvements

Support for other platforms (Twitter/X, forums)

User history & saved summaries

Advanced sentiment breakdown

Chrome extension version

📜 License

This project was built for educational and hackathon purposes.
