import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");

  const fetchTransactions = () => {
    axios
      .get("http://localhost:5000/api/transactions")
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async () => {
    if (!title || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/transactions", {
        title,
        amount: Number(amount),
        type,
      });

      setTitle("");
      setAmount("");
      setType("Income");

      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  const totalIncome = transactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Salary & Expense Tracker</h1>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Enter Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      <br /><br />

      <button onClick={addTransaction}>
        Add Transaction
      </button>

      <hr />

      <h3>Total Income: ₹{totalIncome}</h3>
      <h3>Total Expense: ₹{totalExpense}</h3>
      <h2>Remaining Balance: ₹{balance}</h2>

      <hr />

      <h2>Transactions</h2>

      <ul>
        {transactions.map((item) => (
          <li key={item._id}>
            {item.title} - ₹{item.amount} ({item.type})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;