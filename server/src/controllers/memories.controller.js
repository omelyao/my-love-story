const pool = require('../db/db');
const fs = require('fs');
const path = require('path');


// ========================================
// GET ALL MEMORIES
// ========================================

const getMemories = async (req, res) => {
   try {
      const result = await pool.query(`
         SELECT *
         FROM memories
         ORDER BY created_at ASC
      `);

      res.json(result.rows);
   } catch (error) {
      console.error(
         'Ошибка при получении воспоминаний:',
         error
      );

      res.status(500).json({
         message: 'Не удалось получить воспоминания',
      });
   }
};


// ========================================
// GET MEMORY BY ID
// ========================================

const getMemoryById = async (req, res) => {
   try {
      const { id } = req.params;

      const result = await pool.query(
         `
         SELECT *
         FROM memories
         WHERE id = $1
         `,
         [id]
      );

      if (result.rows.length === 0) {
         return res.status(404).json({
            message: 'Воспоминание не найдено',
         });
      }

      res.json(result.rows[0]);
   } catch (error) {
      console.error(
         'Ошибка при получении воспоминания:',
         error
      );

      res.status(500).json({
         message: 'Не удалось получить воспоминание',
      });
   }
};


// ========================================
// CREATE MEMORY
// ========================================

const createMemory = async (req, res) => {
   try {
      const { title, description } = req.body;

      // Проверяем title
      if (!title || !title.trim()) {
         return res.status(400).json({
            message: 'Title обязателен',
         });
      }

      // Проверяем description
      if (!description || !description.trim()) {
         return res.status(400).json({
            message: 'Description обязателен',
         });
      }

      // Проверяем фотографию
      if (!req.file) {
         return res.status(400).json({
            message: 'Фотография обязательна',
         });
      }

      const image = `/uploads/memories/${req.file.filename}`;

      const result = await pool.query(
         `
         INSERT INTO memories (
            title,
            description,
            image
         )
         VALUES ($1, $2, $3)
         RETURNING *
         `,
         [
            title.trim(),
            description.trim(),
            image,
         ]
      );

      res.status(201).json(result.rows[0]);
   } catch (error) {
      console.error(
         'Ошибка при создании воспоминания:',
         error
      );

      // Если БД не создала запись,
      // удаляем уже загруженный файл
      if (req.file) {
         const filePath = path.join(
            process.cwd(),
            'uploads',
            'memories',
            req.file.filename
         );

         if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
         }
      }

      res.status(500).json({
         message: 'Не удалось создать воспоминание',
      });
   }
};


// ========================================
// DELETE MEMORY
// ========================================

const deleteMemory = async (req, res) => {
   try {
      const { id } = req.params;

      // Сначала получаем запись
      const result = await pool.query(
         `
         SELECT *
         FROM memories
         WHERE id = $1
         `,
         [id]
      );

      if (result.rows.length === 0) {
         return res.status(404).json({
            message: 'Воспоминание не найдено',
         });
      }

      const memory = result.rows[0];

      // Удаляем запись из PostgreSQL
      await pool.query(
         `
         DELETE FROM memories
         WHERE id = $1
         `,
         [id]
      );

      // Получаем имя файла
      const fileName = path.basename(memory.image);

      // Путь к физическому файлу
      const filePath = path.join(
         process.cwd(),
         'uploads',
         'memories',
         fileName
      );

      // Удаляем физический файл
      if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
      }

      res.json({
         message: 'Воспоминание удалено',
         memory,
      });
   } catch (error) {
      console.error(
         'Ошибка при удалении воспоминания:',
         error
      );

      res.status(500).json({
         message: 'Не удалось удалить воспоминание',
      });
   }
};


module.exports = {
   getMemories,
   getMemoryById,
   createMemory,
   deleteMemory,
};