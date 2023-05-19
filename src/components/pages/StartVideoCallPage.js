import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../stylesheets/StartVideoCallPageStyles.css";
import VideoCall from "../videoCalling/VideoCall";
import capture from "../images/Capture.png";
import friends from "../images/CookWithFriends.png";
import backgroundImage from "../images/pexels-katerina-holmes-5908187.jpg";
import finishedProduct from "../images/pexels-photo-70497.jpeg";

/**
 * Cook Together Page - Start a Video Call Page
 * Page for the initial state of the Cook Together page. Initially the user is shown, an image at the
 * top of the page, a slideshow of images displayed on the left side of the page and buttons to start
 * or join a call. To join a call the user must enter a valid room code. The user can start a call
 * without a code, however to start a call the user must have a recipe selected.
 *
 * Main image available at: https://www.pexels.com/photo/crop-women-cooking-pasta-in-kitchen-5908187/ Accessed: 04/2023
 * Slideshow image available at: https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1 Accessed: 04/2023
 *
 * @author Owen Gittins w19039374
 */

export default function StartVideoCallPage(props) {
  const [recipes, setRecipes] = useState([]); //Array to store recipe list
  const [chosenRecipe, setChosenRecipe] = useState(""); //String to store users selected recipe
  const [inCall, setInCall] = useState(false); //Boolean for storing users in call state
  const [currentIndex, setCurrentIndex] = useState(0); //Current index of slideshow
  const [errorText, setErrorText] = useState(""); //Error text String for any errors when a user tries to start or join a call
  const [inCallCode, setInCallCode] = useState(""); //String to store the code for the call
  const [inputCode, setInputCode] = useState(""); //String to set the code input by the user when joining a call

  const timeout = 10000;
  const timeoutRef = React.useRef(null);
  const location = useLocation();
  const slides = [
    {
      url: capture,
      title: "Choose from a selection of recipes!",
    },
    {
      url: friends,
      title: "Call your friends and cook together!",
    },

    {
      url: finishedProduct,
      title: "Enjoy your finished product!",
    },
  ];

  const handleChosenRecipe = (recipe) => {
    setChosenRecipe(recipe);
  };

  const inputCodeHandler = (event) => {
    setInputCode(event.target.value);
  };

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  //Displays every recipe in the recipes useState array to be used in the scrolling list.
  const allRecipes = recipes.map((recipe, key) => (
    <section
      key={key}
      className="recipeInDisplay"
      onClick={() => handleChosenRecipe(recipe["recipeName"])}
    >
      {recipe["recipeName"]}
    </section>
  ));

  //Update the slideshow every 10 seconds (on update of the currentIndex useState)
  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((index) =>
          index === slides.length - 1 ? 0 : index + 1
        ),
      timeout
    );
  }, [currentIndex, slides.length]);

  //On page load fetch every recipe from the recipes endpoint of the API
  useEffect(() => {
    fetch("http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/recipes")
      .then((response) => response.json())
      .then((json) => {
        setRecipes(json.data);
      })
      .catch((e) => {
        console.log(e.message);
      });
    //If a recipe has been selected (in state) from the recipes page, set the chosen recipe to that recipes name
    if (location.state !== null) {
      setChosenRecipe(location.state.recName);
    }
  }, [location.state]);

  //Create a new, random callcode, using the callcode send a request to the addcall recipe API endpoint (to create a new row in the database)
  const addNewCall = (id) => {
    let callcode = new Array(10)
      .fill()
      .map(() => String.fromCharCode(Math.random() * 65 + 40))
      .join("");
    fetch(
      "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/addcallrecipe?recipeid=" +
        id +
        "&callcode=" +
        callcode,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        //if successful put the user in a call
        setInCall(true);
        setInCallCode(callcode);
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  //Check if the user has chosen a recipe, if they do run addNewCall using the chosenRecipeID
  const createACall = () => {
    if (chosenRecipe !== "") {
      let chosenRecipeID = -1;
      recipes.map((recipe) =>
        recipe.recipeName === chosenRecipe
          ? (chosenRecipeID = recipe.recipeID)
          : null
      );
      addNewCall(chosenRecipeID);
    } else {
      setErrorText("Please choose a recipe before creating a call");
    }
  };

  //If the input code is correct length, send a fetch request to the viewcode endpoint of the API to see if it is a valid code
  const joinACall = () => {
    if (inputCode.length === 10) {
      fetch(
        " http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/viewcode?callcode=" +
          inputCode,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          if (json.data.length === 1) {
            setInCall(true);
          } else {
            setErrorText("Invalid room code, please try again");
          }
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else {
      setErrorText(
        "Please choose a recipe from the recipes page before creating a call."
      );
    }
  };

  //Used to create the buttons for joining and starting a video call
  const createCallButtonsCode = (
    <div className="startCallButtonContainer">
      <div className="startCallButtonItem">
        <div className="startCallButtonTitle">Cook Together</div>
        <div className="borderLine"></div>
        <div className="selectedRecipeContainer">
          <div className="selectedRecipe">
            {location.state === null && chosenRecipe === ""
              ? null
              : "Selected Recipe "}
          </div>
          <div className="selectedRecipeName">
            {chosenRecipe === null ? null : " " + chosenRecipe}
          </div>
        </div>
        <button onClick={createACall} className="startCallButton">
          Start a Call
        </button>

        <input
          placeholder="Enter a call code"
          className="joinCallInput"
          onChange={inputCodeHandler}
        ></input>
        <button onClick={joinACall} className="joinCallButton">
          Join Call
        </button>
      </div>
      <div className="createCallErrorText">
        {errorText === "" ? null : errorText}
      </div>
    </div>
  );

  return (
    <div>
      <div className="startVideoCallContainer">
        <div
          className="pageTitleCookTogether"
          style={{
            backgroundImage: inCall ? null : `url(${backgroundImage})`,
            zIndex: "1",
            height: inCall ? "0px" : "100%",
            padding: inCall ? "0px" : "15%",
          }}
        ></div>

        {/*If the user is in a call, show the video call and hide the join/start a call side of the page
          If the user is not in a call, hide the vido call and display the join/start a call side of the page  */}
        {inCall ? (
          <VideoCall
            setInCall={setInCall}
            ingredients={undefined}
            instructions={undefined}
            callcode={inCallCode}
            inputCode={inputCode}
          />
        ) : (
          <div className="startVideoCallContent">
            <div className="recipeDisplayTitle">
              Choose a recipe here or on the RECIPES page
            </div>
            <div className="recipeDisplay">{allRecipes}</div>
            <div className="slideshow">
              <div
                style={{
                  transform: `translate3d(${-currentIndex * 100}%, 0, 0)`,
                }}
                className="slideshowSlider"
              >
                {slides.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundImage: `url(${image.url})`,
                    }}
                    className="slide"
                  >
                    <div className="slideshowTitle">{image.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/*If the user is not logged in then do not display the buttons, otherwise show the buttons */}
            {location.state === null
              ? props.authenticated === true
                ? createCallButtonsCode
                : null
              : location.state.userID !== -1
              ? createCallButtonsCode
              : null}
          </div>
        )}
      </div>
    </div>
  );
}
