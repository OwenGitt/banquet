/**
 * DataCard
 *
 * This function creates a column div around every RecipeCard.
 * The RecipeCard function is then called.
 *
 * @author Owen Gittins
 */
import RecipeCard from "./RecipeCard";
import "../stylesheets/RecipesPageStyles.css";

function DataCard(props) {
  return (
    <div>
      <div className="column">
        <RecipeCard
          data={props.data}
          faves={props.faves}
          userID={props.userID}
          isAccountPage={props.isAccountPage}
        />
      </div>
    </div>
  );
}
export default DataCard;
