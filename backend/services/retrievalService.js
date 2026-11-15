const generateEmbeddings =require('./embeddingService.js')

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vectorA, vectorB) => {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];

    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

// Find the most relevant chunks
const retrieveRelevantChunks = async (chunks, question) => {

  // Step 1: Generate embedding for user question
  const [questionEmbedding] = await generateEmbeddings(
    [question],
    "RETRIEVAL_QUERY"
  );

  // Step 2: Calculate similarity with every chunk
  const scoredChunks = chunks
    .filter(chunk => chunk.embedding?.length > 0)
    .map(chunk => ({
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,

      score: cosineSimilarity(
        questionEmbedding,
        chunk.embedding
      )
    }));

  // Step 3: Sort by highest similarity
  scoredChunks.sort((a, b) => b.score - a.score);

  // Step 4: Return top 3 relevant chunks
  return scoredChunks.slice(0, 3);
};

module.exports= retrieveRelevantChunks;
