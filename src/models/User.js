const pool = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create({ mobile, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO Users (mobile, password, role)
      VALUES ($1, $2, $3)
      RETURNING user_id, mobile, role
    `;
    const values = [mobile, hashedPassword, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByMobile(mobile) {
    const query = 'SELECT * FROM Users WHERE mobile = $1';
    const { rows } = await pool.query(query, [mobile]);
    return rows[0];
  }

  static async findById(user_id) {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
  }
}

module.exports = User;