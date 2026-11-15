
const express=require('express')
const { retrieveChunks,askQuestion } =require('../controllers/chatController.js');

const chatRouter = express.Router();
chatRouter.post("/:documentId/ask", askQuestion);

module.exports= chatRouter;
