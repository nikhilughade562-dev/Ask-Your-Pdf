const mongoose=require('mongoose')
const Document= require('../models/documentModel.js')
const retrieveRelevantChunks=require('../services/retrievalService.js')
const generateAnswer=require('../services/geminiService.js')

const askQuestion = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { question } = req.body;

    // Validate document ID
    if (!mongoose.isValidObjectId(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID"
      });
    }

    // Validate question
    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a question"
      });
    }

    // Find the uploaded document
    const document = await Document.findById(documentId)
      .select("originalName chunks");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    // Step 1: Retrieve relevant chunks
    const relevantChunks = await retrieveRelevantChunks(
      document.chunks,
      question
    );

    if (relevantChunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No embedded chunks found for this document"
      });
    }

    // Step 2: Prepare context from retrieved chunks
    const context = relevantChunks
      .map((chunk) => chunk.text)
      .join("\n\n");

    // Step 3: Generate answer using Gemini
    const answer = await generateAnswer(
      question,
      context
    );

    // Step 4: Return answer and source information
    return res.status(200).json({
      success: true,
      documentName: document.originalName,
      question,
      answer,
      sources: relevantChunks.map((chunk) => ({
        chunkIndex: chunk.chunkIndex,
        score: chunk.score
      }))
    });

  } catch (error) {
    console.error("Question answering error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate answer"
    });
  }
};

module.exports= { retrieveChunks,askQuestion };
