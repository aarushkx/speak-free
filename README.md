# SpeakFree

**Say It Freely**  
_A simple, anonymous messaging platform designed for honest and open communication._

---

## 📌 Overview

**SpeakFree** is a modern web app designed to let users receive and send messages anonymously. Users can create a public profile to start receiving anonymous notes, feedback, or confessions, while anyone — with or without an account — can send thoughtful messages with complete privacy. The platform aims to foster open communication without the fear of judgment or exposure.

---

## ✨ Features

- **Anonymous Messaging**  
  Anyone can send messages without needing to create an account.

- **Public Profiles**  
  Registered users get a shareable link and a public profile others can message.

- **Private Inbox**  
  All incoming messages are securely stored for registered users to view at any time.

- **AI-Assisted Messaging**  
  Compose thoughtful anonymous messages with help from AI-powered suggestions.

- **Privacy Controls**  
  Users can toggle message reception availability at any time.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Database**: MongoDB
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS, Shadcn UI
- **AI Integration**: Google Generative AI

---

## ⚙️ Environment Variables

```env
MONGODB_URI=<your_mongo_connection_string>

NEXTAUTH_SECRET=<your_nextauth_secret>

GOOGLE_GENERATIVE_AI_API_KEY=<your_google_gemini_api_key>

RESEND_API_KEY=<resend_api_key>
RESEND_FROM_EMAIL=<verified_sender_email>
```

---

## 🔍 Preview

![Preview Image](public/preview.png)

---

## 🌐 View Live

[https://speakfree.vercel.app](https://speakfree.vercel.app)
