import { useMemo, useState } from "react";
import "./App.css";

const STORAGE_KEY = "expense-tracker-items";

const DEFAULT_CATEGORIES = [
  "Groceries",
  "Rent",
  "Utilities",
  "Transport",
  "Dining",
  "Entertainment",
  "Health",
  "Subscriptions",
  "Shopping",
  "Other",
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const safeParse = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [items, setItems] = useState(() =>
    safeParse(localStorage.getItem(STORAGE_KEY) || "[]")
  );
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Groceries",
    date: new Date().toISOString().slice(0, 10),
  });
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const persist = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amountValue = Number(form.amount);
    if (!form.title.trim() || Number.isNaN(amountValue) || amountValue <= 0) {
      return;
    }

    const nextItem = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      amount: amountValue,
      type: form.type,
      category: form.category,
      date: form.date,
    };

    persist([nextItem, ...items]);
    setForm((current) => ({
      ...current,
      title: "",
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    }));
  };

  const handleRemove = (id) => {
    persist(items.filter((item) => item.id !== id));
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [items, search, typeFilter, categoryFilter]);

  const { income, expense, balance } = useMemo(() => {
    const totals = items.reduce(
      (acc, item) => {
        if (item.type === "income") acc.income += item.amount;
        if (item.type === "expense") acc.expense += item.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
    return {
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense,
    };
  }, [items]);

  const categoryTotals = useMemo(() => {
    const totals = items
      .filter((item) => item.type === "expense")
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});

    return Object.entries(totals)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [items]);

  const maxCategoryTotal =
    categoryTotals.length > 0
      ? Math.max(...categoryTotals.map((item) => item.total))
      : 1;

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Expense Tracker</p>
          <h1>Track spending with clarity and calm.</h1>
          <p className="subtitle">
            Log income and expenses, filter by category, and keep your balance in
            check.
          </p>
        </div>
        <div className="summary">
          <div>
            <span>Balance</span>
            <strong>{formatCurrency(balance)}</strong>
          </div>
          <div>
            <span>Income</span>
            <strong>{formatCurrency(income)}</strong>
          </div>
          <div>
            <span>Expenses</span>
            <strong>{formatCurrency(expense)}</strong>
          </div>
        </div>
      </header>

      <section className="grid">
        <form className="card form" onSubmit={handleSubmit}>
          <div className="card-title">
            <h2>Add transaction</h2>
            <p>Everything is saved locally in your browser.</p>
          </div>
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="e.g. Grocery run"
            />
          </label>
          <div className="row">
            <label>
              Amount
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
                placeholder="0"
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="row">
            <label>
              Type
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({ ...current, type: event.target.value }))
                }
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
              >
                {DEFAULT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit">Add transaction</button>
        </form>

        <div className="card">
          <div className="card-title">
            <h2>Spending insight</h2>
            <p>Top categories this month.</p>
          </div>
          <div className="chart">
            {categoryTotals.length === 0 && (
              <p className="empty">Add expenses to see your breakdown.</p>
            )}
            {categoryTotals.map((item) => (
              <div key={item.category} className="chart-row">
                <span>{item.category}</span>
                <div className="bar">
                  <span
                    style={{
                      width: `${(item.total / maxCategoryTotal) * 100}%`,
                    }}
                  />
                </div>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card table">
        <div className="card-title">
          <h2>Transactions</h2>
          <p>Search, filter, and review recent activity.</p>
        </div>
        <div className="filters">
          <input
            placeholder="Search by title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All categories</option>
            {DEFAULT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="rows">
          {filteredItems.length === 0 && (
            <p className="empty">No transactions yet.</p>
          )}
          {filteredItems.map((item) => (
            <div key={item.id} className="row-item">
              <div>
                <h3>{item.title}</h3>
                <span>{item.category}</span>
              </div>
              <div>
                <strong className={item.type}>
                  {item.type === "expense" ? "-" : "+"}
                  {formatCurrency(item.amount)}
                </strong>
                <span>{item.date}</span>
              </div>
              <button type="button" onClick={() => handleRemove(item.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
