import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);
import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [budget, setBudget] = useState(
  localStorage.getItem("budget") || ""
);
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: ""
  });
const [darkMode, setDarkMode] = useState(false);
const [search, setSearch] = useState("");
const [monthFilter, setMonthFilter] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fetchTransactions = async () => {
  try {
    const response = await API.get(
      "/transactions/all",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data) {
      setTransactions(response.data);
    }

  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
  const loadData = async () => {
    await fetchTransactions();
  };

  loadData();
}, []);

const deleteTransaction = async (id) => {

  try {

    await API.delete(

      `/transactions/delete/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

    fetchTransactions();

  }

  catch(error) {

    console.log(error);

  }

};

const editTransaction = (transaction) => {

  setEditId(transaction.id);

  setForm({
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date
  });

};

const updateTransaction = async () => {

  try {

    await API.put(

      `/transactions/update/${editId}`,

      form,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

    setEditId(null);

    setForm({
      amount: "",
      type: "expense",
      category: "",
      description: "",
      date: ""
    });

    fetchTransactions();

  }

  catch(error) {

    console.log(error);

  }

};

  const addTransaction = async () => {
    try {

      await API.post(
        "/transactions/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setForm({
        amount: "",
        type: "expense",
        category: "",
        description: "",
        date: ""
      });

      fetchTransactions();

    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };
  const exportPDF = () => {

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Smart Expense Tracker", 14, 20);

  doc.setFontSize(12);
  doc.text(`User: ${name}`, 14, 30);

  doc.text(`Total Income: Rs. ${income}`, 14, 40);
doc.text(`Total Expense: Rs. ${expense}`, 14, 50);
doc.text(`Savings: Rs. ${savings}`, 14, 60);

  autoTable(doc, {
    startY: 75,

    head: [[
      "Amount",
      "Type",
      "Category",
      "Description",
      "Date"
    ]],

    body: transactions.map((t) => [
      `Rs. ${t.amount}`,
      t.type,
      t.category,
      t.description,
      t.date
    ])
  });

  doc.save("Expense_Report.pdf");
};

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
localStorage.setItem(
  "income",
  income
);

localStorage.setItem(
  "expense",
  expense
);
const savings = income - expense;
let aiMessage = "";

if (expense > income) {

  aiMessage =
    "Your expenses are higher than your income. Try reducing unnecessary spending.";

}
else if (savings < income * 0.2) {

  aiMessage =
    "Your savings are below 20% of your income. Consider saving more.";

}
else if (savings > income * 0.5) {

  aiMessage =
    "Excellent! You are saving more than 50% of your income.";

}
else {

  aiMessage =
    "Your financial health looks balanced.";

}
const filteredTransactions = transactions.filter((t) => {

  const searchMatch =

    t.category
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    t.description
      .toLowerCase()
      .includes(search.toLowerCase());

  const monthMatch =

    monthFilter === ""

    ||

    t.date.startsWith(monthFilter);

  return searchMatch && monthMatch;

});
const expenseTransactions =
  transactions.filter(
    (t) => t.type === "expense"
  );

const categoryTotals = {};

expenseTransactions.forEach((t) => {

  categoryTotals[t.category] =
    (categoryTotals[t.category] || 0)
    + Number(t.amount);

});

let topCategory = "";

let maxAmount = 0;

Object.entries(categoryTotals)
.forEach(([category, amount]) => {

  if(amount > maxAmount){

    maxAmount = amount;

    topCategory = category;

  }

});
const remainingBudget =
  budget - expense;

const budgetUsed =
  budget > 0
    ? (expense / budget) * 100
    : 0;

let alertMessage = "";

if (budgetUsed >= 100) {

  alertMessage =
    "🚨 Budget exceeded!";

}

else if (budgetUsed >= 80) {

  alertMessage =
    "⚠ Budget almost exhausted";

}
  const chartData = {

  labels: transactions.map(
    (t) => t.category
  ),

  datasets: [

    {

      label: "Amount",

      data: transactions.map(
        (t) => t.amount
      ),

      backgroundColor: [

        "#22c55e",
        "#ef4444",
        "#3b82f6",
        "#f59e0b",
        "#8b5cf6",
        "#ec4899"

      ]

    }

  ]

};

  return (
    <div
  className={`min-h-screen ${
    darkMode
      ? "bg-slate-900 text-white"
      : "bg-slate-100 text-black"
  }`}
>

      {/* Navbar */}
      <div
  className={`shadow-md px-10 py-5 flex justify-between items-center ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-black"
  }`}
>
        <div>
         <h1
  className={`text-3xl font-bold ${
    darkMode
      ? "text-white"
      : "text-slate-800"
  }`}
>
  Smart Expense Tracker
</h1>

          <p
  className={`${
    darkMode
      ? "text-gray-300"
      : "text-gray-500"
  }`}
>
  Welcome back, {name}
</p>
        </div>

<button
  onClick={() => setDarkMode(!darkMode)}
  className="bg-gray-700 text-white px-4 py-2 rounded-lg mr-3"
>
  {darkMode ? "☀ Light" : "🌙 Dark"}
</button>
<button
  onClick={() => window.location.href="/profile"}
  className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-3"
>
  Profile
</button>
<button
  onClick={exportPDF}
  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-3"
>
  Export PDF
</button>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-green-500 text-white p-6 rounded-2xl shadow-lg">
            <p>Total Income</p>
            <h1 className="text-4xl font-bold">
              ₹{income}
            </h1>
          </div>

          <div className="bg-red-500 text-white p-6 rounded-2xl shadow-lg">
            <p>Total Expense</p>
            <h1 className="text-4xl font-bold">
              ₹{expense}
            </h1>
          </div>

          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <p>Savings</p>
            <h1 className="text-4xl font-bold">
              ₹{savings}
            </h1>
          </div>

        </div>
        <div
  className={`mt-6 p-6 rounded-2xl shadow-lg ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-black"
  }`}
>

  <h2 className="text-xl font-bold mb-3">

    Smart Insights

  </h2>
  <div
  className={`mt-6 p-6 rounded-2xl shadow-lg ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-black"
  }`}
>

  <h2 className="text-2xl font-bold mb-4">

    🤖 AI Spending Suggestions

  </h2>

  <p className="text-lg">

    {aiMessage}

  </p>

</div>
  <p>

    🏆 Highest Spending Category:
    {" "}
    {topCategory || "N/A"}

  </p>

  <p>

    💰 Total Savings:
    ₹{savings}

  </p>

  <p>

    📊 Total Transactions:
    {transactions.length}

  </p>

</div>
 <div className="bg-yellow-500 text-white p-6 rounded-2xl shadow-lg">

  <p>
    Remaining Budget
  </p>

  <h1 className="text-4xl font-bold">

    ₹{remainingBudget}

  </h1>
  </div>
  <div
  className={`mt-6 p-6 rounded-2xl shadow-lg ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-black"
  }`}
>

  <h2 className="text-xl font-bold mb-3">
    Monthly Budget
  </h2>

  <input
    type="number"
    placeholder="Enter Budget"
    value={budget}
    onChange={(e) => {

      setBudget(e.target.value);

      localStorage.setItem(
        "budget",
        e.target.value
      );

    }}
    className="border p-3 rounded-lg"
  />

  {alertMessage && (

    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg">

      {alertMessage}

    </div>

  )}

</div>
        {/* Add Transaction */}
        <div
  className={`mt-8 rounded-2xl shadow-lg p-6 ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-black"
  }`}
>

          <h2 className="text-2xl font-bold mb-5">
            {editId
  ? "Update Transaction"
  : "Add Transaction"}
          </h2>

          <div className="grid md:grid-cols-5 gap-4">

            <input
              className={`border rounded-lg p-3 ${
  darkMode
    ? "bg-slate-700 text-white border-slate-600"
    : "bg-white text-black"
}`}
              placeholder="Amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />

            <select
              className={`border rounded-lg p-3 ${
  darkMode
    ? "bg-slate-700 text-white border-slate-600"
    : "bg-white text-black"
}`}
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select
  className={`border rounded-lg p-3 ${
  darkMode
    ? "bg-slate-700 text-white border-slate-600"
    : "bg-white text-black"
}`}
  name="category"
  value={form.category}
  onChange={handleChange}
>

  <option value="">
    Select Category
  </option>

  <option value="Food">
    Food
  </option>

  <option value="Travel">
    Travel
  </option>

  <option value="Shopping">
    Shopping
  </option>

  <option value="Bills">
    Bills
  </option>

  <option value="Education">
    Education
  </option>

  <option value="Entertainment">
    Entertainment
  </option>

  <option value="Salary">
    Salary
  </option>

  <option value="Other">
    Other
  </option>

</select>

            <input
              className={`border rounded-lg p-3 ${
  darkMode
    ? "bg-slate-700 text-white border-slate-600"
    : "bg-white text-black"
}`}
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            <input
              className={`border rounded-lg p-3 ${
  darkMode
    ? "bg-slate-700 text-white border-slate-600"
    : "bg-white text-black"
}`}
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

          </div>

          <button
            onClick={
  editId
    ? updateTransaction
    : addTransaction
}
            className="mt-5 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            {editId
  ? "Update Transaction"
  : "Add Transaction"}
          </button>

        </div>

        {/* Transactions Table */}
        <div
  className={`mt-8 rounded-2xl shadow-lg p-6 ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-black"
  }`}
>

          <h2 className="text-2xl font-bold mb-5">
            Recent Transactions
          </h2>
          <input
  type="text"
  placeholder="Search Category or Description..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-3 rounded-lg mb-4 w-full"
/>
<select
  value={monthFilter}
  onChange={(e) => setMonthFilter(e.target.value)}
  className="border p-3 rounded-lg mb-4 w-full"
>

  <option value="">
    All Months
  </option>

  <option value="2026-05">
    May 2026
  </option>

  <option value="2026-06">
    June 2026
  </option>

  <option value="2026-07">
    July 2026
  </option>

</select>
          <table
  className={`w-full ${
    darkMode
      ? "text-white"
      : "text-black"
  }`}
>

            <thead>
              <tr
  className={`${
    darkMode
      ? "border-slate-600"
      : "border-gray-300"
  } border-b`}
>
                <th className="text-left py-3">Amount</th>
                <th className="text-left">Type</th>
                <th className="text-left">Category</th>
                <th className="text-left">Description</th>
                <th className="text-left">Date</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredTransactions.map((t) => (

                <tr key={t.id} className="border-b">

                  <td className="py-3">
                    ₹{t.amount}
                  </td>

                  <td>
                    {t.type}
                  </td>

                  <td>
                    {t.category}
                  </td>

                  <td>
                    {t.description}
                  </td>

                  <td>
                    {t.date}
                  </td>
                  <td>

<button
  onClick={() => editTransaction(t)}
  className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
>
  Edit
</button>
<button
  onClick={() => deleteTransaction(t.id)}
  className="bg-red-500 text-white px-3 py-1 rounded"
>

Delete

</button>

</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div
  className={`mt-8 rounded-2xl shadow-lg p-6 ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-white text-black"
  }`}
>

  <h2 className="text-2xl font-bold mb-5">
    Expense Analytics
  </h2>

  <div className="w-96 mx-auto">
    <Pie data={chartData} />
  </div>

</div>

      </div>

    </div>
  );
}

export default Dashboard;