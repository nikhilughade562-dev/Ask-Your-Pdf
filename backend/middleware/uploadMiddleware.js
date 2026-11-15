const multer=require('multer')
const fs=require('fs')
const path=require('path')

// Ensure uploads directory exists
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure where files are stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}` +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  }
});

// Validate uploaded files
const fileFilter = (req, file, cb) => {
  const isPDF =
    file.mimetype === "application/pdf" &&
    path.extname(file.originalname).toLowerCase() === ".pdf";

  if (isPDF) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  //max of 10 mb
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});

module.exports=upload;
