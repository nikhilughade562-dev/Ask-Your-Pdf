const express =require('express')
const cors=require('cors')
const connectDB=require('./config/db.js')
const documentRoutes=require('./routes/documentRoutes.js')
const chatRoutes=require('./routes/chatRoutes.js')
const dotenv=require('dotenv')
dotenv.config()

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ask Your PDF API is running"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
