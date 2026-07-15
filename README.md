# 🦑 SquidAI

Welcome to **SquidAI**, a modern, intelligent web application built with cutting-edge web technologies. It features a conversational AI interface, voice recognition, image generation capabilities, and a sleek user experience.

## ✨ Key Features

- **Conversational AI**: Seamless chat interface powered by Google Generative AI (Gemini).
- **Speech Recognition**: Built-in voice-to-text functionality for hands-free interactions.
- **Image Generation**: Create images directly from the chat interface.
- **Secure Authentication**: Integrated Google OAuth via NextAuth.js.
- **Persistent Sessions**: Chat history and user sessions are securely stored in MongoDB.
- **Smooth Animations**: High-performance animations and smooth scrolling powered by Framer Motion and Lenis.
- **Modern UI**: Accessible and beautiful components built with Tailwind CSS v4 and Radix UI.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, v16)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Lenis](https://lenis.studiofreight.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **AI Integration**: `@google/generative-ai`

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:
- Node.js (v18.17.0 or higher)
- npm or yarn
- A MongoDB database (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/HarshPariya/SquidAI.git
cd SquidAI
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

> **Security Note:** Never commit your `.env` or `.env.local` files to version control.

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Google OAuth Providers
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# AI API Keys
GOOGLE_API_KEY=your_google_generative_ai_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable React components (Chat Interface, UI elements).
- `/hooks`: Custom React hooks (e.g., `use-speech-recognition`).
- `/api`: Next.js API routes (Authentication, Transcription, Image Generation, Database operations).

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
