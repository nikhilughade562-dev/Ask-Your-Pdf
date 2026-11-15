const {GoogleGenAI}=require('@google/genai')
const dotenv=require('dotenv')
dotenv.config()

const generateAnswer = async (question, context) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is missing");
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are an assistant that answers questions about uploaded PDF documents.

Answer the user's question using only the information provided in the context below.

Instructions:
- Do not use outside knowledge.
- Do not make up information.
- If the answer is not available in the context, say:
  "I couldn't find the answer in the uploaded PDF."
- Give a clear and easy-to-understand answer.

Context:
${context}

Question:
${question}

Answer:
`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt
    });

    return response.text;

  } catch (error) {
    console.error("Gemini generation error:", error.message);
    throw new Error("Failed to generate answer");
  }
};

module.exports= generateAnswer;