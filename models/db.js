const { pool } = require("../config/database");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

const initDB = async () => {
  try {
    await pool.query(createTableQuery);
    console.log("Table initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

const db = {
  createItem: async (item) => {
    const { name, description } = item;
    const query =
      "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *";
    const values = [name, description];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getAllItems: async () => {
    try {
      const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getItemById: async (id) => {
    try {
      const query = "SELECT * FROM items WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  updateItem: async (id, item) => {
    const { name, description } = item;
    const query =
      "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *";
    const values = [name, description, id];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      const query = "DELETE FROM items WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = { initDB, ...db };
