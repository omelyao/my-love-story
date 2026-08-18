const express = require('express');
const multer = require('multer');
const path = require('path');

const {
   getMemories,
   getMemoryById,
   createMemory,
   deleteMemory,
} = require('../controllers/memories.controller');

const router = express.Router();


// ========================================
// MULTER
// ========================================

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/memories');
   },

   filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);

      const fileName = `${Date.now()}${extension}`;

      cb(null, fileName);
   },
});


const upload = multer({
   storage,

   limits: {
      fileSize: 5 * 1024 * 1024,
   },

   fileFilter: (req, file, cb) => {
      const allowedTypes = [
         'image/jpeg',
         'image/jpg',
         'image/png',
         'image/webp',
      ];

      if (allowedTypes.includes(file.mimetype)) {
         cb(null, true);
      } else {
         cb(
            new Error(
               'Можно загружать только изображения'
            )
         );
      }
   },
});


// ========================================
// ROUTES
// ========================================

// GET /api/memories
router.get('/', getMemories);


// GET /api/memories/:id
router.get('/:id', getMemoryById);


// POST /api/memories
router.post(
   '/',
   upload.single('image'),
   createMemory
);


// DELETE /api/memories/:id
router.delete(
   '/:id',
   deleteMemory
);


module.exports = router;