import PropTypes from "prop-types";
import "../css/CategoryFilter.css";

function CategoryFilter({ categories, currentFilter, onFilterChange }) {
  return (
    <div className="category-filter">
      <div className="filter-header">
        <h3>Filter by Category</h3>
      </div>
      <div className="filter-options">
        <button
          className={currentFilter === "all" ? "active" : ""}
          onClick={() => onFilterChange("all")}
        >
          All Tasks
        </button>

        {categories.map((category) => (
          <button
            key={category}
            className={currentFilter === category ? "active" : ""}
            onClick={() => onFilterChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.array.isRequired,
  currentFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default CategoryFilter;
