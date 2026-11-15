# Ask Your PDF — AI-Powered PDF Question Answering System

**Ask Your PDF** is a full-stack Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and ask natural-language questions about their content.

The application extracts text from uploaded PDFs, divides it into smaller overlapping chunks, generates embeddings using Google's Gemini Embedding API, and stores the chunks and embeddings in MongoDB. When a user asks a question, the system retrieves the most relevant chunks using cosine similarity and passes them to Gemini to generate a context-aware answer.

---

## Features

- **PDF Upload:** Upload PDF documents through a React interface.
- **Text Extraction:** Extract readable text from PDFs using `pdf-parse`.
- **Text Chunking:** Split extracted text into smaller chunks with overlap to preserve context.
- **Embedding Generation:** Generate vector embeddings using Google's Gemini Embedding API.
- **Document Storage:** Store document metadata, text chunks, and embeddings in MongoDB.
- **Semantic Retrieval:** Embed user questions and retrieve the top 3 relevant chunks using cosine similarity.
- **AI-Powered Answers:** Generate answers with Gemini using the retrieved document content as context.
- **Source References:** Return the chunk indices used to generate each answer.

---

## Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI / LLM** | Google Gemini API |
| **Embeddings** | Gemini Embedding API (`gemini-embedding-001`) |
| **PDF Processing** | Multer, `pdf-parse` |
| **HTTP Client** | Axios |
| **Similarity Search** | Cosine Similarity |

---

## How It Works

The application follows two main stages of a basic RAG pipeline.

### 1. Document Processing and Indexing
1. The user uploads a PDF through the React frontend.
2. Multer handles the file upload on the backend.
3. `pdf-parse` extracts readable text from the PDF.
4. The extracted text is divided into smaller chunks with overlapping content.
5. Gemini generates an embedding vector for each chunk.
6. The document metadata, chunks, and embeddings are stored in MongoDB.

### 2. Question Answering and Retrieval
1. The user's question is converted into an embedding using Gemini with the `RETRIEVAL_QUERY` task type.
2. The question embedding is compared with the stored chunk embeddings using cosine similarity.
3. The top 3 most relevant chunks are selected.
4. The retrieved chunks and the user's question are passed to Gemini as context.
5. Gemini generates an answer based on the retrieved content.
6. The answer and source chunk references are returned to the frontend.

---

## RAG Pipeline
![RAG Pipeline](<RAG-Pipeline.png>)
---



## Getting Started

### Prerequisites
- Node.js (use a version supported by your installed Google GenAI SDK)
- MongoDB Atlas account or a local MongoDB instance
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ask-your-pdf
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```
The backend runs at `http://localhost:5000`.

### 3. Frontend Setup
Open another terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
Open the local Vite URL, usually `http://localhost:5173`.

---


## Project Scope

This is a learning-oriented project built to understand and implement the fundamental concepts of Retrieval-Augmented Generation using the MERN stack and Gemini APIs.

The current implementation performs cosine similarity calculations in application code over the chunks of the selected document. It is intended for learning and small-scale usage rather than production-scale vector search.
