const {GoogleGenAI}=require('@google/genai')
const dotenv=require('dotenv')
dotenv.config()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateEmbeddings = async (
  texts,
  taskType = "RETRIEVAL_DOCUMENT"
) => {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: texts,
      config: {
        taskType: taskType
      }
    });

    // Return numerical vectors
    return response.embeddings.map(
      (embedding) => embedding.values
    );

  } catch (error) {
    console.error("Embedding generation failed:", error.message);
    throw new Error("Failed to generate embeddings");
  }
};

module.exports= generateEmbeddings;
