const fs =require('fs/promises')
const Document=require('../models/documentModel.js')
const extractTextFromPDF=require('../services/pdfService.js')
const createChunks=require('../services/chunkService.js')
const generateEmbeddings=require('../services/embeddingService.js')

const uploadDocument = async (req, res) => {
  let filePath;
  try {
    // Check whether a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file"
      });
    }

    filePath = req.file.path;

    // Step 1: Extract text from PDF
    const extractedText =
      await extractTextFromPDF(filePath);

    // Step 2: Divide extracted text into chunks
    const chunks = createChunks(extractedText);

    // Step 3: Generate embeddings for all chunks
    const texts = chunks.map((chunk) => chunk.text);

    const embeddings = await generateEmbeddings(
      texts,
      "RETRIEVAL_DOCUMENT"
    );

    // Step 4: Attach embeddings to their respective chunks
    chunks.forEach((chunk, index) => {
      chunk.embedding = embeddings[index];
    });

    // Step 5: Save document and chunks in MongoDB
    const document = await Document.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      chunks
    });

    return res.status(201).json({
      success: true,
      message: "PDF uploaded and processed successfully",

      document: {
        id: document._id,
        originalName: document.originalName,
        totalChunks: document.chunks.length
      }
    });

  } catch (error) {

    // Remove uploaded file if processing fails
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }

    console.error("Document upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "PDF processing failed"
    });
  }
};

module.exports= { uploadDocument };
