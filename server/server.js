const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const memoriesRoutes = require('./src/routes/memories.routes');

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// STATIC FILES
// ========================================

app.use(
   '/uploads',
   express.static(
      path.join(__dirname, 'uploads')
   )
);


// ========================================
// ROUTES
// ========================================

app.use(
   '/api/memories',
   memoriesRoutes
);


// ========================================
// HEALTH CHECK
// ========================================

app.get('/', (req, res) => {
   res.json({
      message: 'Our Memory API работает ❤️',
   });
});


// ========================================
// 404
// ========================================

app.use((req, res) => {
   res.status(404).json({
      message: 'Маршрут не найден',
   });
});


// ========================================
// ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
   console.error(error);

   // Слишком большой файл
   if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
         message:
            'Фотография слишком большая. Максимум 5 MB.',
      });
   }

   // Неправильный тип файла
   if (
      error.message ===
      'Можно загружать только изображения'
   ) {
      return res.status(400).json({
         message: error.message,
      });
   }

   res.status(500).json({
      message: 'Внутренняя ошибка сервера',
   });
});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(
      `Server started on http://localhost:${PORT}`
   );
});