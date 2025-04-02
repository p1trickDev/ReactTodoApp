import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import "../css/TodoForm.css";

function TodoForm({ onAdd, categories, onCategoryAdd }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      dueDate: dueDate || null,
      category: category || null,
    });

    setTitle("");
    setDueDate("");
    // Keep the selected category for consecutive additions
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Instead of creating a todo, we'll just notify and add the category
      onCategoryAdd(newCategory.trim());
      setNewCategoryName(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
      setShowNotification(true);
    }
  };

  return (
    <>
      <form className="todo-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Add new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-input"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date:</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            {isAddingCategory ? (
              <div className="new-category-input">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="small-button"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="small-button cancel"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="category-selector">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">None</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                  className="small-button"
                >
                  + New
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Category created notification */}
      <Modal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        title="Category Created"
        type="notification"
      >
        <div className="notification-message">
          <div className="notification-icon">✓</div>
          <p>
            New category <strong>{newCategoryName}</strong> has been created
            successfully!
          </p>
        </div>
      </Modal>
    </>
  );
}

TodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onCategoryAdd: PropTypes.func.isRequired,
};

export default TodoForm;
