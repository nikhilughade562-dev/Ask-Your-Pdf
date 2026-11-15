const fs=require('fs/promises')
const pdf= require('pdf-parse')

const extractTextFromPDF = async (filePath) => {
  try {
    const buffer = await fs.readFile(filePath);

    const data = await pdf(buffer);

    const extractedText = data.text.trim();

    if (!extractedText) {
      throw new Error(
        "No readable text found in the PDF"
      );
    }

    return extractedText;

  } catch (error) {
    throw new Error(
      `PDF extraction failed: ${error.message}`
    );
  }
};

module.exports= extractTextFromPDF;
