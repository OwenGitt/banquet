import "../stylesheets/RecipesPageStyles.css";

/**
 * Search
 *
 * This function creates a search bar that can be used.
 * The 'handler' prop determines what should happen when
 * the search value is changed. The 'searchTerm' prop is
 * the value entered by the user.
 *
 * @author Owen Gittins
 */

function Search(props) {
  const onChange = (event) => props.handler(event.target.value);

  return (
    <div>
      <label className="customInput">
        <input
          value={props.searchTerm}
          onChange={onChange}
          id="defaultValue"
          placeholder={props.default}
        />
      </label>
    </div>
  );
}
export default Search;
