import { useState, useEffect } from "react";

function App() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);

  // ✅ Load from localStorage and handle daily reset
  useEffect(() => {
    const saved = localStorage.getItem("habits");
    const lastReset = localStorage.getItem("lastResetDate");
    const today = new Date().toDateString();

    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset 'done' status if the day has changed
      if (lastReset !== today) {
        const resetHabits = parsed.map((h) => ({ ...h, done: false }));
        setHabits(resetHabits);
        localStorage.setItem("lastResetDate", today);
        localStorage.setItem("habits", JSON.stringify(resetHabits));
      } else {
        setHabits(parsed);
      }
    } else {
      localStorage.setItem("lastResetDate", today);
    }
  }, []);

  // ✅ Save habits to localStorage
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // ✅ Add new habit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (habit.trim()) {
      const newHabit = { text: habit.trim(), done: false };
      setHabits([...habits, newHabit]);
      setHabit("");
    }
  };

  // ✅ Delete a single habit
  const handleDelete = (indexToDelete) => {
    const updatedHabits = habits.filter((_, index) => index !== indexToDelete);
    setHabits(updatedHabits);
  };

  // ✅ Toggle done/undone
  const toggleDone = (indexToToggle) => {
    const updated = habits.map((habit, index) =>
      index === indexToToggle ? { ...habit, done: !habit.done } : habit
    );
    setHabits(updated);
  };

  // ✅ Clear all habits
  const handleClearAll = () => {
    setHabits([]);
    localStorage.removeItem("habits");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">🧠 Habit Tracker</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Enter a new habit"
          className="px-4 py-2 border rounded"
          value={habit}
          onChange={(e) => setHabit(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Habit
        </button>
      </form>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleClearAll}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          🧹 Clear All Habits
        </button>
      </div>

      <ul className="mt-8 max-w-md mx-auto">
        {habits.map((habit, index) => (
          <li
            key={index}
            className={`bg-white shadow p-3 mb-2 border-l-4 flex justify-between items-center ${
              habit.done ? "border-green-500" : "border-blue-500"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={habit.done}
                onChange={() => toggleDone(index)}
              />
              <span className={habit.done ? "line-through text-gray-500" : ""}>
                {habit.text}
              </span>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
