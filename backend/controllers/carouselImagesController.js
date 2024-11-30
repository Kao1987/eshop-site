// backend/controllers/carouselImagesController.js
const pool = require('../config/db');


// 獲取所有輪播圖
exports.getAllCarouselImages = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM carousel_images');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 根據 ID 獲取單個輪播圖
exports.getCarouselImageById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM carousel_images WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '輪播圖未找到' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增輪播圖
exports.createCarouselImage = async (req, res) => {
  try {
    const imageUrl = `/img/carouselImages/${req.file.filename}`;
    const [result] = await pool.query('INSERT INTO carousel_images (url) VALUES (?)', [imageUrl]);
    res.status(201).json({ id: result.insertId, url:imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 更新輪播圖
exports.updateCarouselImage = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [result] = await pool.query('UPDATE carousel_images SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '輪播圖未找到' });
    }
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 刪除輪播圖
exports.deleteCarouselImage = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM carousel_images WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '輪播圖未找到' });
    }
    res.json({ message: '輪播圖已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
