import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [page, setPage] = useState("form"); // "form" or "summary"

  const fetchTransactions = async () => {
    const res = await axios.get("http://localhost:5000/api/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    if (!title || !amount) return alert("Please fill all fields");
    await axios.post("http://localhost:5000/api/transactions", {
      title,
      amount: Number(amount),
      type,
    });
    setTitle("");
    setAmount("");
    fetchTransactions();
    setPage("summary"); // <-- Go to next page after adding
  };

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="container">
      <h1>Salary & Expense Tracker</h1>

      {page === "form" && (
        <div className="form-box">
          <h2>Add Transaction</h2>
          <input
            type="text"
            placeholder="Title e.g. Salary, Shop"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <button onClick={addTransaction}>Add Transaction</button>
        </div>
      )}

      {page === "summary" && (
        <div className="summary-box">
          <button className="back-btn" onClick={() => setPage("form")}>
            ← Back to Add
          </button>
          <h2>Your Summary</h2>
          <p><b>Total Income:</b> ₹{totalIncome}</p>
          <p><b>Total Expense:</b> ₹{totalExpense}</p>
          <h3>Remaining Balance: ₹{balance}</h3>

          <h3>Transactions</h3>
          <ul>
            {transactions.map((t) => (
              <li key={t._id} className={t.type}>
                {t.title} - ₹{t.amount} ({t.type})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
