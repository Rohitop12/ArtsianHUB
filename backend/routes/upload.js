const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, upload.single('image'), (req, res) => {
    res.json({
        message: 'Image Uploaded',
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
    });
});

router.post('/multiple', protect, upload.array('images', 5), (req, res) => {
    const imageUrls = req.files.map(
        (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
    );
    res.json({
        message: 'Images Uploaded',
        imageUrls,
    });
});

module.exports = router;
