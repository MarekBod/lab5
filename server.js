const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./data.json";

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all
app.get("/destinations", (req, res) => {
  res.json(readData());
});

// GET one
app.get("/destinations/:id", (req, res) => {
  const item = readData().find(d => d.id == req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// CREATE
app.post("/destinations", (req, res) => {
  const data = readData();
  const newItem = { id: Date.now(), ...req.body };
  data.push(newItem);
  saveData(data);
  res.json(newItem);
});

// UPDATE
app.put("/destinations/:id", (req, res) => {
  const data = readData();
  const index = data.findIndex(d => d.id == req.params.id);

  if (index === -1) return res.status(404).json({ error: "Not found" });

  data[index] = { ...data[index], ...req.body };
  saveData(data);

  res.json(data[index]);
});

// DELETE
app.delete("/destinations/:id", (req, res) => {
  const newData = readData().filter(d => d.id != req.params.id);
  saveData(newData);
  res.json({ message: "Deleted" });
});

// START SERVER
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
