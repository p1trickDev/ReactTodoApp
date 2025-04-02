import PropTypes from "prop-types";
import TodoItem from "./TodoItem";
import "../css/TodoList.css";

function TodoList({ todos, onToggle, onDelete, onEdit, activeTab }) {
  // Filter todos based on active tab
  let filteredTodos = [];

  if (activeTab === "all") {
    filteredTodos = todos;
  } else if (activeTab === "uncategorized") {
    filteredTodos = todos.filter((todo) => !todo.category);
  } else {
    filteredTodos = todos.filter((todo) => todo.category === activeTab);
  }

  return (
    <div className="todo-list">
      <div className="todo-items-container">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          <p className="empty-state">
            {activeTab === "all"
              ? "No tasks found. Add some tasks to get started!"
              : activeTab === "uncategorized"
              ? "No uncategorized tasks. Add some tasks without a category."
              : `No tasks found in "${activeTab}" category.`}
          </p>
        )}
      </div>
    </div>
  );
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default TodoList;
