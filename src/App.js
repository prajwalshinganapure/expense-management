import React, { useState, useEffect } from "react";
import NewExpense from "./components/NewExpense/NewExpense";
import Expenses from "./components/Expenses/Expenses";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [expenses, setExpenses] = useState([]);

  // ✅ FETCH DATA FROM FIRESTORE
  useEffect(() => {
    const fetchExpenses = async () => {
      const q = query(collection(db, "expenses"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

    const loadedExpenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      amount: doc.data().amount,
      date: doc.data().date.toDate(), // ⭐ IMPORTANT
    }));


      setExpenses(loadedExpenses);
    };

    fetchExpenses();
  }, []);

  // ✅ ADD EXPENSE TO FIRESTORE
  const addExpenseHandler = async (expense) => {
    const docRef = await addDoc(collection(db, "expenses"), {
      title: expense.title,
      amount: Number(expense.amount),
      date: new Date(expense.date),
    });

    setExpenses((prev) => [
      { id: docRef.id, ...expense },
      ...prev,
    ]);
  };

  return (
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses item={expenses} />
    </div>
  );
}

export default App;
