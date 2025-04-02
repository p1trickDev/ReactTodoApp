import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [activeTab, setActiveTab] = useState("uncategorized");
  const [allCompletedModal, setAllCompletedModal] = useState(false);
  // New state for standalone categories
  const [standaloneCategories, setStandaloneCategories] = useState([]);
  // State to track which task completions have been shown
  const [shownCompletions, setShownCompletions] = useState({});

  // Extract unique categories from todos and merge with standalone categories
  const categories = [
    ...new Set([
      ...standaloneCategories,
      ...todos.filter((todo) => todo.category).map((todo) => todo.category),
    ]),
  ];

  // Check if all tasks in current tab are completed
  useEffect(() => {
    const currentTodos =
      activeTab === "all"
        ? todos
        : activeTab === "uncategorized"
        ? todos.filter((todo) => !todo.category)
        : todos.filter((todo) => todo.category === activeTab);

    // Generate a key for the current tab and tasks
    const completionKey = `${activeTab}-${currentTodos
      .map((t) => t.id)
      .join("-")}`;

    // Only show completion modal if:
    // 1. There are tasks
    // 2. All are completed
    // 3. This exact set of completed tasks hasn't triggered a notification yet
    if (
      currentTodos.length > 0 &&
      currentTodos.every((todo) => todo.completed) &&
      !shownCompletions[completionKey]
    ) {
      setAllCompletedModal(true);
      // Mark this completion set as shown
      setShownCompletions((prev) => ({
        ...prev,
        [completionKey]: true,
      }));
    }
  }, [todos, activeTab, shownCompletions]);

  const addTodo = (todo) => {
    setTodos((prevTodos) => [...prevTodos, todo]);

    // Switch to the new category tab if a todo with new category is added
    if (todo.category && !categories.includes(todo.category)) {
      setActiveTab(todo.category);
    }
  };

  const handleCategoryAdd = (newCategory) => {
    // Add the category to standalone categories if it doesn't already exist
    if (!categories.includes(newCategory)) {
      setStandaloneCategories((prev) => [...prev, newCategory]);
      // Switch to the new category tab immediately
      setActiveTab(newCategory);
    }
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    // When a todo is deleted, we should reset the completion tracking for the current tab
    // This allows the completion modal to show again if all remaining tasks are completed
    const currentKey = `${activeTab}-`;
    const updatedCompletions = { ...shownCompletions };

    // Remove any completion records for this tab
    Object.keys(updatedCompletions).forEach((key) => {
      if (key.startsWith(currentKey)) {
        delete updatedCompletions[key];
      }
    });

    setShownCompletions(updatedCompletions);
  };

  const editTodo = (id, updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );

    // Reset completion tracking if a task is edited
    // This allows the modal to show again after editing and re-completing tasks
    const currentKey = `${activeTab}-`;
    const updatedCompletions = { ...shownCompletions };

    Object.keys(updatedCompletions).forEach((key) => {
      if (key.startsWith(currentKey)) {
        delete updatedCompletions[key];
      }
    });

    setShownCompletions(updatedCompletions);
  };

  // Get the name of the current tab for display purposes
  const getCurrentTabName = () => {
    if (activeTab === "all") return "All Tasks";
    if (activeTab === "uncategorized") return "Uncategorized Tasks";
    return activeTab;
  };

  return (
    <div className="todo-app">
      {/* <header>
        <h2>Todo List</h2>
      </header> */}

      <main>
        <section className="todo-container">
          <TodoForm
            onAdd={addTodo}
            categories={categories}
            onCategoryAdd={handleCategoryAdd}
          />

          <div className="tab-navigation">
            <button
              className={activeTab === "uncategorized" ? "active-tab" : ""}
              onClick={() => setActiveTab("uncategorized")}
            >
              Uncategorized
            </button>
            <button
              className={activeTab === "all" ? "active-tab" : ""}
              onClick={() => setActiveTab("all")}
            >
              All Tasks
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={activeTab === category ? "active-tab" : ""}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="todo-content">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              activeTab={activeTab}
            />
          </div>
        </section>
      </main>

      {/* All tasks completed modal */}
      <Modal
        isOpen={allCompletedModal}
        onClose={() => setAllCompletedModal(false)}
        title="All Tasks Completed!"
        type="success"
      >
        <div className="notification-message success">
          <div className="notification-icon">🎉</div>
          <p>
            Congratulations! You've completed all tasks in{" "}
            <strong>{getCurrentTabName()}</strong>.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default App;
