//Import useState, useEffect and router
import React, { useState, useEffect } from "react";
import "../stylesheets/AccountPageStyles.css";
import RecipesPage from "./RecipesPage";

/**
 * Account Page
 *
 * The account page displays a list of the user's favourite recipes in the centre
 * and their personal information on the left-hand side of the page.
 *
 * @author Owen Gittins w19039374
 */

//Props: authenticated, allPosts
function AccountPage(props) {
  //UseStates used for user information
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(undefined);
  const [completed, setCompleted] = useState(undefined);

  //Fetch the user's details from the viewusers endpoint with the parameter "userID"
  const fetchUserDetails = () => {
    if (props.authenticated === true && localStorage.getItem("token")) {
      var token = localStorage.getItem("token");
      token = token.split(".");
      var tokenData = JSON.parse(atob(token[1]));

      fetch(
        "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/viewusers?userID=" +
          tokenData["sub"],
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setFirstName(json.data[0].forename);
          setSurname(json.data[0].surname);
          setUsername(json.data[0].username);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }
  };

  //Set the page to a loading state while the data is loaded
  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      fetchUserDetails();
      setTimeout(() => {
        setCompleted(true);
      }, 200);
    }, 1500);
  }, []);

  return (
    <div className="accountPageContainer">
      {props.authenticated ? (
        !completed ? (
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
            <div className="userPageLayout">
              <div className="userInfo">
                <div className="userInfoData">
                  <h4 className="userInfoTitle">Account Details</h4>
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    className="userInfoPicture"
                    alt="Placeholder profile, white sillouhette of a person"
                  ></img>
                  <div className="userInfoName">
                    <b>{firstName + " " + surname}</b>
                  </div>
                  <div className="userInfoUsername">{username}</div>
                </div>
              </div>
              <div className="main">
                <h2
                  style={{
                    marginLeft: "1%",
                    marginRight: "80%",
                    marginBottom: "-2%",
                    marginTop: "7%",
                    fontSize: "20pt",
                    zIndex: "1",
                  }}
                >
                  Your Favourites
                </h2>
                <RecipesPage
                  isAccountPage={true}
                  authenticated={props.authenticated}
                />
              </div>
            </div>
          </>
        )
      ) : (
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          Login to access this page
        </div>
      )}
    </div>
  );
}

export default AccountPage;
