import React, { useState, useEffect } from "react";
import DataCard from "../features/DataCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "../stylesheets/RecipesPageStyles.css";
import Search from "../features/Search";
import { Link } from "react-router-dom";

/**
 * Recipes Page
 *
 * The recipes page displays a list of recipes to the user in a row/column layout.
 * Several filters and a search bar can be used by the user to filter the recipe
 * list. When viewing the account page the user will be shown a list of their
 * favourite recipes (recipe list is filtered using a seperate array fetched
 * from the API).
 *
 * @author Owen Gittins
 */
function RecipesPage(props) {
  const [searchTerm, setSearchTerm] = useState(""); //A String to hold the search term entered by the user (for filtering the recipes)
  const [faves, setFaves] = useState([]); //An array to hold a list of the users favourite recipes
  const [userID, setUserID] = useState(-1); //An integer to hold the user's ID value
  const [recipes, setRecipes] = useState([]); //An array to hold the list of recipes
  const [checkedIngredient, setCheckedIngredient] = useState(""); //A String used to hold the value of the selected main ingredient filter
  const [filterActive, setFilterActive] = useState(-1); //An integer to determine whether a filter is active or not
  const [subMenuOpen, setSubMenuOpen] = useState(false); //A Boolean to determine if the dropdown menu for the main ingredients filter is open or not
  const [checkedCategory, setCheckedCategory] = useState(""); //A String to hold the value of the selected category of food
  const [ingredientSearch, setIngredientSearch] = useState(""); //A String to hold the value of the user's entered search term for the main ingredients

  const handleChange = (event, mainIngredientKey) => {
    if (event.target.checked === true) {
      setCheckedIngredient(event.target.value);
      setFilterActive(mainIngredientKey);
    } else {
      setCheckedIngredient("");
      setFilterActive(-1);
    }
  };
  const searchHandler = (event) => {
    setSearchTerm(event);
  };

  const searchIngredientHandler = (event) => {
    setIngredientSearch(event);
  };

  const handleCategory = (event) => {
    if (event.target.checked === true) {
      setCheckedCategory(event.target.value);
    } else {
      setCheckedCategory("");
    }
  };

  const filterCategory = (value) => {
    const category = value.category;
    return category.toLowerCase().includes(checkedCategory.toLowerCase());
  };

  const filterIngredients = (value) => {
    const ingredients = value.mainIngredient;
    return ingredients.toLowerCase().includes(checkedIngredient.toLowerCase());
  };

  const searchRecipes = (value) => {
    const recipeName = value.recipeName;
    return recipeName.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const searchIngredients = (value) => {
    const recipeName = value;
    return recipeName.toLowerCase().includes(ingredientSearch.toLowerCase());
  };

  //Display each recipe on a card in a row/column layout
  const allRecipes = recipes
    .filter(searchRecipes)
    .filter(filterIngredients)
    .filter(filterCategory)
    .map((recipe, key) => (
      <section key={key}>
        <DataCard
          data={recipe}
          faves={faves}
          userID={userID}
          isAccountPage={props.isAccountPage}
        />
      </section>
    ));

  //Display each recipe on a card in a row/column layout but filter by the user's favourites using the faves array
  const faveRecipes = recipes
    .filter(searchRecipes)
    .filter(filterIngredients)
    .filter(filterCategory)
    .map((recipe, key) => (
      <div key={key}>
        {faves.map((faveRecipe, faveRecipeKey) => (
          <div key={faveRecipeKey}>
            {faveRecipe.recipeID === recipe.recipeID ? (
              <DataCard
                data={recipe}
                userID={userID}
                faves={faves}
                isAccountPage={props.isAccountPage}
              />
            ) : null}
          </div>
        ))}
      </div>
    ));

  useEffect(() => {
    //fetch all the recipes from the recipes endpoint of the api
    fetch("http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/recipes")
      //turn the response from the URL into JSON
      .then((response) => response.json())
      .then((json) => {
        //set recipes constant to the data array from the returned JSON
        setRecipes(json.data);
      })
      .catch((e) => {
        console.log(e.message);
      });
    //If the user is logged in (authenticated) and a token is available then fetch the user's favourite posts
    if (props.authenticated === true && localStorage.getItem("token")) {
      var token = localStorage.getItem("token");
      token = token.split(".");
      var tokenData = JSON.parse(atob(token[1]));

      fetch(
        "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/favs?userID=" +
          tokenData["sub"]
      )
        .then((response) => response.json())
        .then((json) => {
          setFaves(json.data);
          setUserID(tokenData["sub"]);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  }, [props.authenticated]);

  //Create an array of all the main ingredients
  const mainIngredients = [];

  recipes.map((recipe) =>
    recipe.mainIngredient === null || recipe.mainIngredient === "undefined"
      ? null
      : mainIngredients.push(recipe.mainIngredient)
  );

  //Remove any duplicate entries in the array so that their are no repeating filters
  const uniqueIngredients = new Set(mainIngredients);
  const mainIngredientsArray = [...uniqueIngredients];

  return (
    <div
      className={
        props.isAccountPage === true ? "pageContainerAccount" : "pageContainer"
      }
    >
      {props.isAccountPage === true ? null : (
        <div className="pageTitle">Recipes</div>
      )}
      <div className="searchContainer">
        <Search
          searchTerm={searchTerm}
          handler={searchHandler}
          default={"Search for a recipe"}
        />
        {searchTerm === "" ? null : (
          <div className="returnedResults">
            {recipes
              .filter(searchRecipes)
              .filter(filterIngredients)
              .filter(filterCategory).length +
              " results for " +
              searchTerm}
          </div>
        )}
      </div>
      <div className="form-input">
        <div className="borderLine"></div>
        <label className="submenuTitleDiet">Filter by diet</label>
        <label className="ingredientsCheckbox">
          <input
            id="meatBox"
            type="checkbox"
            value="meat"
            onChange={handleCategory}
            disabled={
              checkedCategory !== "meat" && checkedCategory !== ""
                ? true
                : false
            }
          />
          <span className="checkmark"></span>
          <div className="ingredientsCheckboxText">Meat</div>
        </label>
        <label className="ingredientsCheckbox">
          <input
            id="veganBox"
            type="checkbox"
            value="vegan"
            onChange={handleCategory}
            disabled={
              checkedCategory !== "vegan" && checkedCategory !== ""
                ? true
                : false
            }
          />
          <span className="checkmark"></span>
          <div className="ingredientsCheckboxText">Vegan</div>
        </label>
        <label className="ingredientsCheckbox">
          <input
            id="vegetarianBox"
            type="checkbox"
            value="vegetarian"
            onChange={handleCategory}
            disabled={
              checkedCategory !== "vegetarian" && checkedCategory !== ""
                ? true
                : false
            }
          />
          <span className="checkmark"></span>
          <div className="ingredientsCheckboxText">Vegetarian</div>
        </label>
        <div className="borderLine"></div>
        <div className="submenu-list">
          <Link onClick={() => setSubMenuOpen(!subMenuOpen)}>
            <div className="submenuTitle">
              {"Filter by main ingredient "}
              <FontAwesomeIcon icon={subMenuOpen === true ? faMinus : faPlus} />
            </div>
          </Link>
          <ul className={`sub-menu ${subMenuOpen === true ? "is-open" : ""}`}>
            <li className="menu-item">
              <Search
                searchTerm={ingredientSearch}
                handler={searchIngredientHandler}
                default={"Search ingredients"}
              />

              {mainIngredientsArray
                .filter(searchIngredients)
                .map((mainIngredient, mainIngredientKey) => (
                  <label
                    key={mainIngredientKey}
                    className="ingredientsCheckbox"
                  >
                    <input
                      id={mainIngredientKey}
                      type="checkbox"
                      value={mainIngredient}
                      onChange={(event) =>
                        handleChange(event, mainIngredientKey)
                      }
                      disabled={
                        mainIngredientKey !== filterActive &&
                        filterActive !== -1
                          ? true
                          : false
                      }
                    />
                    <span className="checkmark"></span>
                    <div className="ingredientsCheckboxText">
                      {mainIngredient}
                    </div>
                  </label>
                ))}
            </li>
          </ul>
        </div>
      </div>

      {props.isAccountPage === true ? (
        faves.length === 1 ? (
          <div className="numFavouritesText">
            {"You have " + faves.length + " favourited recipe"}
          </div>
        ) : (
          <div className="numFavouritesText">
            {"You have " + faves.length + " favourited recipes"}
          </div>
        )
      ) : null}
      <div
        className={
          props.isAccountPage === true
            ? "cardContainerAccount"
            : "cardContainer"
        }
      >
        <div className="row">
          {props.isAccountPage === true ? faveRecipes : allRecipes}
        </div>
      </div>
    </div>
  );
}

export default RecipesPage;
