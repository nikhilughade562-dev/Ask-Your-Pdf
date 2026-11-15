
const createChunks = (
  text,
  chunkSize = 1000,
  overlap = 200
) => {
  const chunks = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    const end = Math.min(
      start + chunkSize,
      text.length
    );

    const chunkText = text.slice(start, end).trim();

    if (chunkText) {
      chunks.push({
        chunkIndex,
        text: chunkText,
        embedding: []
      });

      chunkIndex++;
    }

    if (end === text.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
};

module.exports= createChunks;
