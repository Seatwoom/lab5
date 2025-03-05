const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/", async (req, res) => {
  try {
    const items = await db.getAllItems();
    res.render("index", { items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res
      .status(500)
      .render("index", { items: [], error: "Failed to fetch items" });
  }
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.createItem({ name, description });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).render("create", { error: "Failed to create item" });
  }
});

router.get("/view/:id", async (req, res) => {
  try {
    const item = await db.getItemById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.render("view", { item });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).send("Server error");
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const item = await db.getItemById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.render("edit", { item });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).send("Server error");
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.updateItem(req.params.id, { name, description });
    res.redirect("/");
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send("Server error");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await db.deleteItem(req.params.id);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
