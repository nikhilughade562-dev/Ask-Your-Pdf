const mongoose=require('mongoose');

const chunkSchema = new mongoose.Schema({
  chunkIndex: {
    type: Number,
    required: true
  },

  text: {
    type: String,
    required: true
  },

  embedding: {
    type: [Number],
    default: []
  }
});

const documentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    chunks: {
      type: [chunkSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model("Document", documentSchema);
module.exports= Document;
