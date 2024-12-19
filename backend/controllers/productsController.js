// backend/controllers/productsController.js
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.createProduct = async (req, res)=>{
  const connection = await pool.getConnection();
  try{
    await connection.beginTransaction();
    console.log('接收到的表單數據:',req.body);
    console.log('接收到的文件',req.file);

    // 解構並驗證字段
    const {
      name,
      description,
      price,
      stock,
      brand_id,
      tag_ids,
      created_at,
    } = req.body;

    if (!name || !description || !price || !stock || !brand_id || isNaN(brand_id)) {
      throw new Error('缺少必要字段');
    }
    // 準備產品數據
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock:parseInt(stock),
      brand_id:parseInt(brand_id),
      updated_at: new Date(),
      created_at:created_at || new Date().toISOString().slice(0,10)
    };

    if(req.file){
      productData.image = `${process.env.PRODUCT_IMAGE_URL}/${req.file.filename}`;
    }

    const [result] = await connection.query('INSERT INTO products SET ?', productData);
    const productId = result.insertId;

    // 處理標籤
    if(tag_ids){
      let parsedTagIds;
      try{
        parsedTagIds = JSON.parse(tag_ids);
      }catch(e){
        parsedTagIds = tag_ids;
      }
      if(Array.isArray(parsedTagIds) && parsedTagIds.length > 0){
        const tagValues = parsedTagIds.map(tagId => [productId,parseInt(tagId)]);
        await connection.query(
          'INSERT INTO product_tags (product_id, tag_id) VALUES ?',[tagValues]
        );
      }
    }
    await connection.commit();

    res.status(201).json({
      message:'產品新增成功',
      productId:productId,
      ...productData
    });
  }catch(error){
    await connection.rollback();
    console.error('新增產品時出錯：',error);

  //如果上傳圖片但處理失敗，刪除圖片。 
    if(req.file){
      const filePath = path.join(__dirname, '..', 'public','img','products',req.file.filename);
      fs.unlink(filePath,(err)=>{
        if(err && err.code !== 'ENOENT'){
          console.error('刪除圖片失敗',err);
        } 
      });
    }

    res.status(500).json({
      message:'新增產品失敗',
      error:error.message
    });
  }finally{
    connection.release();
  }
}

// 獲取所有產品
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.description, p.price, p.stock, p.image,  
      GROUP_CONCAT(t.name) AS tags,
      p.brand_id, p.created_at, p.updated_at
      FROM products p
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id, p.name, p.description, p.price, p.stock, p.image, p.brand_id, p.created_at, p.updated_at
      `);

    const products = rows.map(product => {
      return {
        ...product,
        tags: product.tags ? product.tags.split(','):[]
      };
    });

    res.status(200).json(products);
  }catch (error) {
    console.error('獲取產品時出錯:', error);
    res.status(500).json({ 
        success: false,
        message: '獲取產品時發生錯誤，請稍後再試'
    });
}
};

// 根據 ID 獲取單個產品
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT p.*, GROUP_CONCAT(t.id) AS tag_ids
      FROM products p
      LEFT JOIN product_tags pt ON p.id = pt.product_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '產品未找到' });
    }
    const product = rows[0];
    product.tag_ids = product.tag_ids ? product.tag_ids.split(',').map(id=>Number(id)) : [];
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// 更新產品
exports.updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try{
    await connection.beginTransaction();

    const {id} = req.params;

    // 檢查產品是否存在
    const [existingProductRows] = await connection.query('SELECT * FROM products WHERE id = ?',[id]);
    if(existingProductRows.length === 0){
      return res.status(404).json({ message: '產品未找到。' });
    }

    // 解構並驗證欄位
    const {
      name,
      description,
      price,
      stock,
      brand_id,
      tag_ids,
    } = req.body;

    if(!name || !description || !price || !stock || !brand_id ||isNaN(brand_id)){
      const missingFields = [];
      if (!name||typeof name != 'string' || name.trim() === '') missingFields.push('name');
      if (!description || typeof description !== 'string' || description.trim()==='') missingFields.push('description');
      if (!price || isNaN(price) || price <= 0) missingFields.push('price');
      if (!stock || isNaN(price) || price < 0) missingFields.push('stock');
      if (!brand_id || isNaN(brand_id)) missingFields.push('brand_id');
      console.error('缺少必要欄位:', missingFields);
      throw new Error('缺少必要欄位');
    }
    // 準備產品數據
    const productData = {
      name,
      description,
      price:parseFloat(price),
      stock:parseInt(stock),
      brand_id:parseInt(brand_id,10),
      updated_at:new Date(),
    };
    if(req.file){
      productData.image = `img/products/${req.file.filename}`;
      if(existingProductRows[0].image){
        const oldImagePath = path.join(__dirname, '..','public',existingProductRows[0].image);
        fs.unlink(oldImagePath,(err)=>{
          if(err && err.code !== 'ENOENT'){
            console.error('刪除圖片失敗',err);
          }
        });
      }
    }
    // 更新產品數據
    await connection.query('UPDATE products SET ? WHERE id = ?', [productData, id]);
    // 更新產品標籤
    await connection.query('DELETE FROM product_tags WHERE product_id = ?',[id]);

    if(tag_ids){
      let parseTagIds;
      try{
        parseTagIds = JSON.parse(tag_ids);
      }catch(e){
        parseTagIds= tag_ids;
      }
      if(Array.isArray(parseTagIds) && parseTagIds.length > 0){
        const tagValues = parseTagIds
        .map(tagId => parseInt(tagId))
        .filter(tagId =>!isNaN(tagId))
        .map(tagId =>[id,tagId]);
        await connection.query('INSERT INTO product_tags (product_id, tag_id) VALUES ?',[tagValues]);
      }
    }
    await connection.commit();
    res.json({
      message:'產品更新成功',
      productId:id,
      ...productData,
    });
    
    }catch(error){
      await connection.rollback();
      console.error('更新產品出錯:',error);
      // 如果上傳圖鑑但處理失敗，刪除圖片！
      if(req.file){
        const filePath = path.join(__dirname,'..','public','img','products',req.file.filename);
        fs.unlink(filePath,(err)=>{
          if(err && err.code !== 'ENOENT'){
            console.error('刪除圖片失敗',err);
          }
        });
      }
      res.status(500).json({
        message:'更新產品品失敗',
        error:error.message,
      });
    }finally{
      connection.release();
    }
}
// 刪除產品
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '產品未找到' });
      }
      res.json({ message: '產品已成功刪除' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '伺服器錯誤' });
    }
}

// 處理搜索產品
exports.searchProducts = async (req, res) =>{
  try{
      const { keyword, page= 1, limit= 10 } = req.query;
      const offset = (page -1) * limit;

      if(!keyword){
        return res.status(400).json({message:'缺少關鍵字'});
      }

      const sanitizedKeyword = keyword.replace(/[%_]/g,'\\$&');
      const [rows] = await pool.query(
        'SELECT * FROM products WHERE name LIKE ? LIMIT ? OFFSET ?',
        [`%${sanitizedKeyword}%`,parseInt(limit),parseInt(offset)]
      );
      res.json(rows);
  }catch(error){
    console.error('搜索產品時出錯:',error);
    res.status(500).json({message:'伺服器錯誤'});
  }
};


