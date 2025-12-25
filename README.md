🧵 Thread Analyzer (TL;DR)

Thread Analyzer is a web-based AI tool that summarizes long Reddit discussion threads into short, meaningful insights using the Gemini API.
It helps users quickly understand key viewpoints and overall sentiment without reading hundreds of comments.

TL;DR — Get the essence, skip the noise.

🚀 Problem Statement

Reddit discussions often contain useful information, but important insights are buried under long comment threads.
Reading everything manually is time-consuming and inefficient.

💡 Solution

Thread Analyzer solves this by:
- Fetching Reddit thread data
- Understanding context using AI
- Generating a concise summary
- Highlighting key discussion points
- Identifying overall sentiment

✨ Features

- Paste any public Reddit thread URL  
- AI-generated summaries using Gemini  
- Key takeaways in bullet points  
- Sentiment analysis (Positive / Neutral / Mixed / Negative)  
- Clean and responsive UI  
- Fast and easy to use  

🛠️ Tech Stack

## Frontend
- HTML  
- CSS  
- JavaScript  
- React (Vite)

## Backend
- Node.js  
- Express.js  

## APIs
- Google Gemini API  
- Reddit Public JSON APIa

🧠 How It Works

1. User pastes a Reddit thread URL  
2. Frontend sends the request to the backend  
3. Backend fetches the thread data  
4. Text is sent to Gemini API  
5. Gemini returns:
   - Summary  
   - Key insights  
   - Sentiment  
6. Results are displayed on the UI

📂 Project Structure

thread-analyzer/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md

⚙️ Setup Instructions

## 1. Clone the repository
git clone https://github.com/Utkarsh2393/threadsummarizer

## 2. Frontend setup
cd frontend
npm install
npm run dev

## 3. Backend setup
cd backend
npm install

Start backend:

node server.js

🔐 API Key Note

API keys are stored using environment variables and are not exposed on the frontend.

🧪 Demo Mode (Hackathon Friendly)

In case live Reddit fetching fails due to network or API limitations, the application can still demonstrate:

- Complete UI flow  
- AI-based summarization using sample thread data  

This ensures smooth demo and evaluation during hackathons.

🎯 Hackathon Relevance

- Solves a real-world problem: information overload  
- Strong and practical use of the Gemini API  
- Fits well under open innovation themes  
- Demonstrates applied AI beyond a basic chatbot  

👥 Team

Team Name: PromptX
Members: Indira Verma

📌 Future Improvements

- Support for additional platforms (X / forums)  
- User history and saved summaries  
- More detailed sentiment breakdown  
- Chrome extension version  


📜 License

This project was built for educational and hackathon purposes.
