import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../stylesheets/IndividualRecipeStyles.css";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import GradeIcon from "@mui/icons-material/Grade";
import { Button } from "@mui/material";

/**
 * Individual Recipe Page
 *
 * The indiviual recipe page displays a recipe to the user. A picture of the finished
 * dish is displayed with two buttons that appear if the user is logged in. One to
 * favourite the button and the other to use the recipe. Below the difficulty and
 * description are shown. Below that is a table that holds the cook and prep time
 * of the recipe, the ingredients and the recipe instructions. At the bottom of the
 * page the comments are displayed where the user can leave a comment if they are logged in.
 *
 * @author Owen Gittins
 */

function IndividualRecipePage(props) {
  const location = useLocation();
  const [favePostIDsArray] = useState([]);
  const [loading, setLoading] = useState(undefined);
  const [completed, setCompleted] = useState(undefined);
  const [isFavourite, setIsFavourite] = useState(false);
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const [userCommented, setUserCommented] = useState(false);

  const onChange = (event) => setUserComment(event.target.value);

  //Sends a fetch request to the addcomment endpoint of the API that will add the user's comment to the database
  const addNewComment = () => {
    if (userComment !== "" || userComment.length() > 3) {
      fetch(
        "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/addcomment?userID=" +
          location.state.userID +
          "&recipeID=" +
          location.state.recID +
          "&comment=" +
          userComment
      )
        .then((response) => response.json())
        .then((json) => {
          //Retrieves the new list of comments and stops the user from being able to comment again until they have refreshed the page
          getComments();
          setUserCommented(true);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  };

  //Clears the user's text in the comment box
  const deleteComment = () => {
    setUserComment("");
  };

  //Checks to see if the post is favourited by the user
  const checkFavourites = () => {
    for (let i = 0; i < location.state.faves.length; i++) {
      let recipeIDToAdd = location.state.faves[i];
      if (!favePostIDsArray.includes(recipeIDToAdd.recipeID)) {
        favePostIDsArray.push(recipeIDToAdd.recipeID);
      }
    }
    if (favePostIDsArray.includes(location.state.recID)) {
      setIsFavourite(true);
    } else {
      setIsFavourite(false);
    }
  };

  /*Retrieves the list of comments for the recipe from the viewcomments endpoint of the API,
   using the recipeID parameter set to the recID of the recipe clicked on*/
  const getComments = () => {
    fetch(
      "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/viewcomments?recipeID=" +
        location.state.recID,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setComments(json.data);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  //Start the page in a loading state and make sure the page is at the top
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      checkFavourites();
      getComments();
      setLoading(true);
      setTimeout(() => {
        setCompleted(true);
      }, 200);
    }, 1500);
  }, []);

  //Navigate the user back to the recipes page upon clicking the back button
  let navigate = useNavigate();
  const routeChange = () => {
    let path = props.backTo;
    navigate(path);
  };

  /*Add or remove the post to or from the user's favourites by sending a fetch request 
  to the removefav or makefav endpoints using the recipes ID and the user's ID*/
  const addOrRemove = () => {
    if (isFavourite === true) {
      setIsFavourite(false);
      fetch(
        "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/removefav?userID=" +
          location.state.userID +
          "&recipeID=" +
          location.state.recID,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }

    if (isFavourite === false) {
      setIsFavourite(true);
      fetch(
        "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/makefav?userID=" +
          location.state.userID +
          "&recipeID=" +
          location.state.recID,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          favePostIDsArray.push(location.state.recID);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  };

  //Navigate the user to the "Cook Together" page and send the required data upon pressing the "Use this recipe now!" button
  const StartVideoCallRoute = () => {
    navigate("/call", {
      state: {
        recName: location.state.recName,
        recDescription: location.state.recDescription,
        recIngredients: location.state.recIngredients,
        recInstructions: location.state.recInstructions,
        recDifficulty: location.state.recDifficulty,
        recPrepTime: location.state.recPrepTime,
        recCookTime: location.state.recCookTime,
        image: location.state.image,
        id: location.state.recID,
        userID: location.state.userID,
      },
    });
  };

  return (
    <div className="recipePageContainer">
      {/*Create the "Back" button for the page */}
      <div className="backButton">
        <button onClick={routeChange} className="customButtonBack">
          Back
        </button>
      </div>

      {/*Create the container the information */}
      <div className="postPageCardContainer">
        <div className="postPageCard">
          {!completed ? (
            <>
              {!loading && (
                <div className="spinner">
                  <span>Loading...</span>
                  <div className="half-spinner"></div>
                </div>
              )}
            </>
          ) : (
            <>
              {/*Create the title and container for the image and buttons for the page */}
              <h1 className="postPageDataTitle">{location.state.recName}</h1>
              <div className="imageAndButton">
                <div className="imageContainer">
                  <img
                    src={location.state.image}
                    alt={location.state.recName + " dish"}
                    className="recipeImg"
                  ></img>
                </div>
                <div className="buttonContainer">
                  {location.state.userID !== -1 && (
                    <div>
                      <button
                        onClick={StartVideoCallRoute}
                        className="useNowButton"
                      >
                        Use this recipe now!
                      </button>
                    </div>
                  )}
                  <div className="favButtonContainer">
                    {location.state.userID !== -1 && (
                      <div className="favText">
                        {isFavourite === false
                          ? "Favourite recipe"
                          : "Unfavourite recipe"}
                      </div>
                    )}

                    {location.state.userID !== -1 && (
                      <Button
                        onClick={addOrRemove}
                        style={{
                          marginTop: "5%",
                        }}
                      >
                        {isFavourite === false ? (
                          <StarOutlineIcon />
                        ) : (
                          <GradeIcon />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {/*Create the container for the description and difficulty */}
              <div className="postPageDataDescription">
                <div className="postPageDataDescription-difficulty">
                  <div className="difficulty">Difficulty</div>
                  <div className="difficultyText">
                    {location.state.recDifficulty}
                  </div>
                </div>
                <div className="postPageDataDescription-description">
                  {location.state.recDescription}
                </div>
              </div>

              <div className="gridPrepCook">
                <div className="gridTitles">
                  <div className="prepTitle">
                    <div>Prep Time</div>
                  </div>
                  <div className="cookTitle">
                    <div>Cook Time</div>
                  </div>
                </div>
                <div className="gridValues">
                  <div className="prepTime">
                    <div className="gridRow">
                      <div className="hours">
                        <div className="hoursNum">
                          {location.state.recPrepTimeHours + " "}
                        </div>
                        <div className="hoursText">hours</div>
                      </div>
                      <div className="minutes">
                        <div className="minutesNum">
                          {location.state.recPrepTimeMinutes}
                        </div>
                        <div className="minutesText">minutes</div>
                      </div>
                    </div>
                  </div>
                  <div className="cookTime">
                    <div className="gridRow">
                      <div className="hours">
                        <div className="hoursNum">
                          {location.state.recCookTimeHours + " "}
                        </div>
                        <div className="hoursText">hours</div>
                      </div>
                      <div className="minutes">
                        <div className="minutesNum">
                          {location.state.recCookTimeMinutes + " "}
                        </div>
                        <div className="minutesText">minutes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*Create the container for the instructions and ingredients */}
              <div className="mainGrid">
                <div className="titleContainer">
                  <div className="ingredientsTitle">Ingredients</div>
                  <div className="instructionsTitle">Instructions</div>
                </div>
                <div className="ingredientSection">
                  <div className="ingredientsContainer">
                    <br></br>
                    {location.state.recIngredients["ingredients"].map(
                      (ingredient, key) => (
                        <div key={key} className="ingredient">
                          {ingredient.amount +
                            " " +
                            ingredient.unit +
                            " " +
                            ingredient.name +
                            (ingredient.preparation !== ""
                              ? " - " + ingredient.preparation
                              : "")}
                        </div>
                      )
                    )}
                  </div>
                  <div className="instructionsContainer">
                    <div>
                      {location.state.recInstructions["instructions"].map(
                        (step, key) => (
                          <div key={key}>
                            <div className="stepSubtitle">
                              {"Step " + step.step}
                            </div>
                            {step.instruction}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/*Create the container for the comments section */}
              <div className="commentSection">
                <div className="commentTitle">Comments</div>
                {/*If the user is logged in, display the add comment form */}
                {location.state.userID !== -1 && userCommented === false && (
                  <div className="addComment">
                    <div>
                      <textarea
                        className="newComment"
                        required
                        placeholder="Enter your comment here..."
                        value={userComment}
                        onChange={onChange}
                      ></textarea>
                      <button
                        onClick={deleteComment}
                        className="deleteCommentButton"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addNewComment}
                        className="postCommentButton"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                )}
                <div
                  className={
                    location.state.userID !== -1 && userCommented === false
                      ? "allComments"
                      : "allCommentsNotLoggedIn"
                  }
                >
                  {/*Display all the comments for the recipe */}
                  {comments.map((comment, commentKey) => (
                    <div key={commentKey} className="comment">
                      <div className="commentName">
                        {comment.forename + " " + comment.surname}
                      </div>
                      <div>{comment.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndividualRecipePage;
