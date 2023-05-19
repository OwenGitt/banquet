import "../stylesheets/RecipeCardStyles.css";
import { useNavigate } from "react-router-dom";

/**
 * Recipe Card
 *
 * The recipe card manages the layout of the card design of the recipes for
 * the recipes page. The recipes can be clicked on to take the user to the
 * individualRecipePage where they will see more information on that recipe.
 * Depending on whether it is in the account page or recipe page will determine
 * what css the recipe card will use.
 *
 * @author Owen Gittins
 */

function RecipeCard(props) {
  let navigate = useNavigate();

  /*If the user clicks on the recipe card, take the user to the recipes/recipedata URL
  and pass all the relevant data for that recipe with it in the state*/
  const recipeDataRoute = () => {
    let path = `recipedata`;
    navigate(path, {
      state: {
        recName: props.data.recipeName,
        recDescription: props.data.description,
        recIngredients: JSON.parse(props.data.ingredients),
        recInstructions: JSON.parse(props.data.instructions),
        recDifficulty: props.data.difficulty,
        recPrepTimeMinutes: props.data.prepTimeMinutes,
        recPrepTimeHours: props.data.prepTimeHours,
        recCookTimeMinutes: props.data.cookTimeMinutes,
        recCookTimeHours: props.data.cookTimeHours,
        image: props.data.photo,
        recID: props.data.recipeID,
        faves: props.faves,
        userID: props.userID,
      },
    });
  };

  return (
    <div>
      <div className="recipeCard" onClick={recipeDataRoute}>
        <div className="titleRowRecipeCard">
          <div
            className={
              props.isAccountPage === true
                ? "titleRecipeCardAccount"
                : "titleRecipeCard"
            }
          >
            {props.data["recipeName"]}
          </div>
        </div>

        <img
          src={props.data.photo}
          className={
            props.isAccountPage === true
              ? "customImgRecipeCardAccount"
              : "customImgRecipeCard"
          }
          alt={"A photo of " + props.data["recipeName"]}
        ></img>
      </div>
    </div>
  );
}

export default RecipeCard;
