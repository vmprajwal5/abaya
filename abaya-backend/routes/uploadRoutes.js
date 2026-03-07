const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// 1. Configure Storage (Where to save and what to name it)
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Images will save to a folder named 'uploads'
    },
    filename(req, file, cb) {
        // Naming convention: fieldname-date.extension (image-123456.jpg)
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// 2. File Validation (Only allow images)
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/; // Allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

// 3. Initialize Upload Middleware
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// 4. The Route
// POST /api/upload
// The frontend sends a file in a form field named 'image'
router.post('/', upload.single('image'), (req, res) => {
    // We send back the path. Frontend will use this path to display the image.
    res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

module.exports = router;