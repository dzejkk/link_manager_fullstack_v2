import express from "express";
import { pool } from "../db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all links for logged-in user (with optional category filter)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { category_id } = req.query;

    let query = "SELECT * FROM links WHERE user_id = $1";
    const params = [req.user.userId];

    if (category_id) {
      query += " AND category_id = $2";
      params.push(category_id);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Get links error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single link
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM links WHERE id = $1 AND user_id = $2",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get link error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new link
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, url, description, category_id } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }

    const result = await pool.query(
      "INSERT INTO links (user_id, category_id, title, url, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.userId, category_id || null, title, url, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create link error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update link
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, description, category_id } = req.body;

    const result = await pool.query(
      "UPDATE links SET title = $1, url = $2, description = $3, category_id = $4, updated_at = NOW() WHERE id = $5 AND user_id = $6 RETURNING *",
      [title, url, description, category_id, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update link error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete link
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Link not found" });
    }

    res.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Delete link error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
