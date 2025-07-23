const pool = require('../config/db');

class Ad {
  static async create({ car_id, user_id, price }) {
    const query = `
      INSERT INTO Ads (car_id, user_id, price)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [car_id, user_id, price]);
    return rows[0];
  }

  static async delete(ad_id) {
    const query = 'DELETE FROM Ads WHERE ad_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [ad_id]);
    return rows[0];
  }
}

module.exports = Ad;