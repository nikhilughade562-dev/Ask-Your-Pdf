import { useRef, useState } from "react";
import {
  FileText,
  Upload,
  Send,
  Bot,
  User,
  LoaderCircle,
  MessageSquare,
  X
} from "lucide-react";

import { uploadPDF, askQuestion } from "./services/api";
import "./App.css";

function App() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [document, setDocument] = useState(null);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);

  const [error, setError] = useState("");

  // Select a PDF
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Upload PDF to backend
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = await uploadPDF(selectedFile);

      setDocument(data.document);
      setMessages([]);

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to upload PDF. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // Ask a question
  const handleAskQuestion = async (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !document || asking) {
      return;
    }

    // Display the user's message immediately
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: trimmedQuestion
      }
    ]);

    setQuestion("");
    setAsking(true);
    setError("");

    try {
      const data = await askQuestion(
        document.id,
        trimmedQuestion
      );

      // Display Gemini's answer
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || []
        }
      ]);

    } catch (error) {
      console.error("Question error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to generate an answer. Please try again."
      );
    } finally {
      setAsking(false);
    }
  };

  // Remove the currently selected document from the UI
  const handleRemoveDocument = () => {
    setDocument(null);
    setSelectedFile(null);
    setMessages([]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <FileText size={23} />
          </div>

          <div>
            <h1>Ask Your PDF</h1>
            <p>Chat with your documents</p>
          </div>
        </div>

        <span className="header-tag">
          AI Powered
        </span>
      </header>

      <main className="main-container">

        {/* Upload Section */}
        <section className="upload-section">

          <div className="section-heading">
            <h2>Your Document</h2>
            <p>Upload a PDF to start asking questions.</p>
          </div>

          {!document ? (
            <div className="upload-card">

              <div className="upload-icon">
                <Upload size={28} />
              </div>

              <h3>Upload your PDF</h3>

              <p>
                Select a PDF document from your device.
              </p>

              <input
                type="file"
                accept=".pdf,application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
              />

              <button
                className="secondary-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Choose PDF
              </button>

              {selectedFile && (
                <div className="selected-file">
                  <FileText size={18} />

                  <span>{selectedFile.name}</span>

                  <button
                    onClick={() => {
                      setSelectedFile(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    aria-label="Remove selected file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {selectedFile && (
                <button
                  className="primary-button"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <LoaderCircle className="spin" size={18} />
                      Processing PDF...
                    </>
                  ) : (
                    "Upload and Process"
                  )}
                </button>
              )}

            </div>
          ) : (
            <div className="document-card">

              <div className="document-icon">
                <FileText size={25} />
              </div>

              <div className="document-info">
                <h3>{document.originalName}</h3>

                <p>
                  {document.totalChunks} chunks generated
                </p>

                <span className="status">
                  <span className="status-dot"></span>
                  Ready to chat
                </span>
              </div>

              <button
                className="remove-button"
                onClick={handleRemoveDocument}
                title="Remove document from current chat"
              >
                <X size={18} />
              </button>

            </div>
          )}

        </section>

        {/* Chat Section */}
        <section className="chat-section">

          <div className="chat-heading">
            <div>
              <h2>Ask Questions</h2>
              <p>
                {document
                  ? "Ask anything about your uploaded document."
                  : "Upload a PDF to enable chat."}
              </p>
            </div>

            <MessageSquare size={22} />
          </div>

          <div className="chat-messages">

            {messages.length === 0 && (
              <div className="empty-chat">
                <div className="empty-chat-icon">
                  <Bot size={32} />
                </div>

                <h3>Start a conversation</h3>

                <p>
                  {document
                    ? "Ask a question about your PDF to get started."
                    : "Your answers will appear here after you upload a PDF."}
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-row ${message.role}`}
              >

                <div className="message-avatar">
                  {message.role === "user" ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}
                </div>

                <div className="message-content">
                  <span className="message-role">
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </span>

                  <div className="message-bubble">
                    {message.content}
                  </div>

                  {message.sources?.length > 0 && (
                    <div className="sources">
                      <span>Sources used:</span>

                      {message.sources.map((source, sourceIndex) => (
                        <span
                          className="source-tag"
                          key={sourceIndex}
                        >
                          Chunk {source.chunkIndex}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}

            {asking && (
              <div className="message-row assistant">

                <div className="message-avatar">
                  <Bot size={18} />
                </div>

                <div className="message-content">
                  <span className="message-role">
                    AI Assistant
                  </span>

                  <div className="message-bubble loading-message">
                    <LoaderCircle className="spin" size={17} />
                    Generating answer...
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Question Input */}
          <form
            className="chat-input-container"
            onSubmit={handleAskQuestion}
          >
            <input
              type="text"
              placeholder={
                document
                  ? "Ask a question about your PDF..."
                  : "Upload a PDF to start chatting..."
              }
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              disabled={!document || asking}
            />

            <button
              type="submit"
              disabled={!document || !question.trim() || asking}
              aria-label="Send question"
            >
              <Send size={19} />
            </button>
          </form>

        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

      </main>

      <footer className="footer">
        Ask Your PDF · Powered by Gemini
      </footer>

    </div>
  );
}

export default App;