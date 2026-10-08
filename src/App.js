import React, { useState, useEffect } from 'react';

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');

    if (savedTransactions) {
      return JSON.parse(savedTransactions);
    }

    return [
      {
        id: 1,
        title: 'راتب الشهر',
        amount: 5500,
        type: 'income',
        category: 'راتب',
        date: '2026-10-01'
      },
      {
        id: 2,
        title: 'فواتير الإنترنت والكهرباء',
        amount: 450,
        type: 'expense',
        category: 'فواتير',
        date: '2026-10-03'
      },
      {
        id: 3,
        title: 'مقاضي البيت والسوبرماركت',
        amount: 1200,
        type: 'expense',
        category: 'مشتريات',
        date: '2026-10-05'
      },
      {
        id: 4,
        title: 'مشروع ترويجي فريلانس',
        amount: 1800,
        type: 'income',
        category: 'عمل حر',
        date: '2026-10-06'
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions([
      {
        ...newTransaction,
        id: Date.now()
      },
      ...transactions
    ]);
  };

  const handleDeleteTransaction = (id) => {
    const confirmed = window.confirm('هل تريد حذف هذه المعاملة؟');

    if (confirmed) {
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction
      )
    );

    setEditingTransaction(null);
  };

  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const netBalance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div
      className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-8"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl shadow-xl gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-3">
              <span>💳</span>
              مدير المصاريف الذكي
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              تتبع ميزانيتك ومدخراتك ومصروفاتك اليومية
            </p>
          </div>

          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-300">
            الحالة:
            <span className="text-emerald-400 font-bold mr-1">
              محفوظ محلياً
            </span>
          </div>
        </header>

        <SummaryCards
          netBalance={netBalance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1">
            <AddTransactionForm
              onAdd={handleAddTransaction}
              editingTransaction={editingTransaction}
              onUpdate={handleUpdateTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">

            <div className="bg-slate-800/60 border border-slate-700/60 p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-3 justify-between items-center">

              <div className="w-full sm:w-60">
                <input
                  type="text"
                  placeholder="🔍 ابحث عن معاملة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700 w-full sm:w-auto">

                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium ${
                    filterType === 'all'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  الكل
                </button>

                <button
                  onClick={() => setFilterType('income')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium ${
                    filterType === 'income'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  الإيرادات
                </button>

                <button
                  onClick={() => setFilterType('expense')}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium ${
                    filterType === 'expense'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  المصروفات
                </button>

              </div>
            </div>

            <TransactionsList
              transactions={filteredTransactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />

          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCards({ netBalance, totalIncome, totalExpense }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg">
        <p className="text-slate-400 text-xs">
          إجمالي الرصيد الصافي
        </p>

        <h3
          className={`text-2xl font-bold mt-2 ${
            netBalance >= 0
              ? 'text-cyan-400'
              : 'text-rose-400'
          }`}
        >
          {netBalance.toLocaleString()}
          <span className="text-xs font-normal text-slate-400 mr-1">
            ج.م
          </span>
        </h3>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg">
        <p className="text-slate-400 text-xs">
          إجمالي الدخل
        </p>

        <h3 className="text-2xl font-bold mt-2 text-emerald-400">
          +{totalIncome.toLocaleString()}
          <span className="text-xs font-normal text-slate-400 mr-1">
            ج.م
          </span>
        </h3>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg">
        <p className="text-slate-400 text-xs">
          إجمالي المصروفات
        </p>

        <h3 className="text-2xl font-bold mt-2 text-rose-400">
          -{totalExpense.toLocaleString()}
          <span className="text-xs font-normal text-slate-400 mr-1">
            ج.م
          </span>
        </h3>
      </div>

    </div>
  );
}

function AddTransactionForm({
  onAdd,
  editingTransaction,
  onUpdate,
  onCancelEdit
}) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('مشتريات');

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) {
      return;
    }

    if (editingTransaction) {
      onUpdate({
        ...editingTransaction,
        title,
        amount: parseFloat(amount),
        type,
        category
      });
    } else {
      onAdd({
        title,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date().toISOString().split('T')[0]
      });
    }

    setTitle('');
    setAmount('');
    setType('expense');
    setCategory('مشتريات');
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl shadow-lg">

      <h2 className="text-lg font-bold text-slate-200 mb-4">
        {editingTransaction
          ? '✏️ تعديل المعاملة'
          : '➕ إضافة معاملة جديدة'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            عنوان المعاملة
          </label>

          <input
            type="text"
            placeholder="مثال: فاتورة مياه، راتب..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            المبلغ (ج.م)
          </label>

          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              نوع المعاملة
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="expense">مصروف (-)</option>
              <option value="income">إيراد (+)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              التصنيف
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm"
            >
              <option value="مشتريات">مشتريات</option>
              <option value="فواتير">فواتير</option>
              <option value="راتب">راتب</option>
              <option value="عمل حر">عمل حر</option>
              <option value="ترفيه">ترفيه</option>
            </select>
          </div>

        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold py-2.5 rounded-xl"
        >
          {editingTransaction
            ? 'حفظ التعديل'
            : 'حفظ وإضافة المعاملة'}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full bg-slate-700 text-slate-200 py-2.5 rounded-xl"
          >
            إلغاء التعديل
          </button>
        )}

      </form>
    </div>
  );
}

function TransactionsList({
  transactions,
  onDelete,
  onEdit
}) {
  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/60 border border-slate-700 p-12 rounded-2xl text-center">
        <div className="text-4xl mb-3">📭</div>

        <h3 className="text-slate-300 font-medium">
          لا توجد معاملات مسجلة
        </h3>

        <p className="text-slate-500 text-xs mt-1">
          قم بإضافة معاملة جديدة أو غيّر كلمات البحث والفلتر
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">

      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-slate-200 text-sm">
          سجل المعاملات
        </h3>

        <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">
          {transactions.length} معاملة
        </span>
      </div>

      <div className="divide-y divide-slate-700">

        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-4 flex items-center justify-between hover:bg-slate-700/20"
          >

            <div className="flex items-center gap-3">

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  transaction.type === 'income'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {transaction.type === 'income' ? '📈' : '📉'}
              </div>

              <div>
                <h4 className="font-bold text-slate-200 text-sm">
                  {transaction.title}
                </h4>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md">
                    {transaction.category}
                  </span>

                  <span className="text-[10px] text-slate-500">
                    {transaction.date}
                  </span>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-2">

              <span
                className={`font-bold text-sm ${
                  transaction.type === 'income'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {transaction.amount.toLocaleString()} ج.م
              </span>

              <button
                onClick={() => onEdit(transaction)}
                className="w-8 h-8 rounded-lg bg-slate-700/40 text-slate-400 hover:text-cyan-400"
                title="تعديل المعاملة"
              >
                ✏️
              </button>

              <button
                onClick={() => onDelete(transaction.id)}
                className="w-8 h-8 rounded-lg bg-slate-700/40 text-slate-400 hover:text-rose-400"
                title="حذف المعاملة"
              >
                🗑️
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}