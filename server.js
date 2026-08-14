const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // This allows React to connect

// 1. Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/salarytracker")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// 2. Create Schema
const TransactionSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

// 3. API Routes

// GET all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, type } = req.body;
    const newTransaction = new Transaction({ title, amount, type });
    await newTransaction.save();
    res.json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));