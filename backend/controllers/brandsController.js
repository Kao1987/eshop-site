// backend/controllers/brandsController.js
const { pool } = require('../config/db');

// 獲取所有廠牌
exports.getAllbrands = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM brands');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 根據 ID 獲取單個廠牌
exports.getbrandById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM brands WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '廠牌未找到' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 新增廠牌
exports.createbrand = async (req, res) => {
  try{
    let brandName;
    if(typeof req.body ==='string'){
      brandName = req.body;
    }else{
      brandName = req.body.name;
    }
    // if(!brandData.name||typeof brandData.name !=='string'){
    //   return res.status(400).json({message:'廠牌名稱是必填的'});
    // }
    const [existing] = await pool.query('SELECT * FROM brands WHERE name = ?', [brandName]);
    if(existing.length > 0){
      return res.status(400).json({message:'廠牌名稱已存在'});
    }
    const [result] = await pool.query('INSERT INTO brands SET ?', brandName);
    res.status(201).json({id:result.insertId, name:brandData.name});
  }catch(error){
    console.error(error);
    res.status(500).json({message:'伺服器錯誤'});
  }
  // try {
    //   const [result] = await pool.query('INSERT INTO brands SET ?', data);
    //   res.status(201).json({ id: result.insertId, ...data });
    // } catch (error) {
      //   console.error(error);
      //   res.status(500).json({ message: '伺服器錯誤' });
      // }
      
};

// 更新廠牌
exports.updatebrand = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const [result] = await pool.query('UPDATE brands SET ? WHERE id = ?', [data, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '廠牌未找到' });
    }
    res.json({ id, ...data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 刪除廠牌
exports.deletebrand = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM brands WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '廠牌未找到' });
    }
    res.json({ message: '廠牌已成功刪除' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
