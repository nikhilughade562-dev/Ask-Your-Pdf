const express=require('express')
const upload=require('../middleware/uploadMiddleware.js')
const {uploadDocument}= require('../controllers/documentController.js')

const docRouter = express.Router();

docRouter.post(
  "/upload",
  upload.single("pdf"),
  uploadDocument
);

module.exports= docRouter;