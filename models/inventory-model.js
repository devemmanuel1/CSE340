const pool = require("../database/")

/* ***************************
 *  Get all classifications
 * ************************** */
async function getClassifications() {
  try {
    const sql = "SELECT * FROM classification ORDER BY classification_name"
    return await pool.query(sql)
  } catch (error) {
    console.error("getClassifications error:", error)
    return null
  }
}

/* ***************************
 *  Get inventory by classification id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql =
      "SELECT * FROM inventory WHERE classification_id = $1 ORDER BY inv_make"
    return await pool.query(sql, [classification_id])
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
    return null
  }
}

/* ***************************
 *  Get inventory by inventory id
 * ************************** */
async function getInventoryByInventoryId(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1"
    return await pool.query(sql, [inv_id])
  } catch (error) {
    console.error("getInventoryByInventoryId error:", error)
    return null
  }
}

/* ***************************
 *  Add classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("addClassification error:", error)
    return null
  }
}

/* ***************************
 *  Add inventory
 * ************************** */
async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const values = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.classification_id,
    ]
    return await pool.query(sql, values)
  } catch (error) {
    console.error("addInventory error:", error)
    return null
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  addInventory,
}
