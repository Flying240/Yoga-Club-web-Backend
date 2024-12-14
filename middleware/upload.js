const multer = require('multer');

// Define storage configuration using memoryStorage
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
    }
};

// Multer configuration with limits and file filter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // Limit file size to 2 MB
    },
    fileFilter: fileFilter,
});

// Middleware to handle file upload
module.exports = upload;
