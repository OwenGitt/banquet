import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/SignupPageStyles.css";

/**
 * Sign up page
 * Page for the sign up form and sending the data to the API when an account is created.
 *
 * @author Owen Gittins w19039374
 */

function SignUp() {
  //Use states for the forms details
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); //Used to check if passwords are correct

  //Use States for handling different errors the user may make
  const [failedMatchingPassword, setFailedMatchingPassword] = useState(false); // Passwords dont match
  const [failedPasswordRequirements, setFailedPasswordRequirements] =
    useState(false); // Password not present
  const [failedSignUp, setFailedSignUp] = useState(false); // Failed to sign up
  const [failedUserExists, setFailedUserExists] = useState(false); // User name alreay exists

  const navigate = useNavigate();

  //Naviagte to the login page
  const routeChange = () => {
    navigate("/login", { state: { created: "Account created successfully." } });
  };

  //Navigate back to the homepage
  const backToHome = () => {
    navigate("/");
  };

  //Handles username
  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  //Handles password
  const handleSurname = (event) => {
    setSurname(event.target.value);
  };

  //Handles username
  const handleUsername = (event) => {
    setFailedUserExists(false);
    setUsername(event.target.value);
  };

  //Handles password
  const handlePassword = (event) => {
    setFailedMatchingPassword(false);
    setFailedPasswordRequirements(false);
    setPassword(event.target.value);
  };

  //Handles confirm password
  const handleConfirmPassword = (event) => {
    setFailedMatchingPassword(false);
    setConfirmPassword(event.target.value);
  };

  //Check the password and confirm password are equal to each other
  const checkPassword = () => {
    if (confirmPassword === password && password) {
      setFailedMatchingPassword(false);
      return true;
    }
    //Sets matching password to ture if they dont match
    setFailedMatchingPassword(true);
    return false;
  };

  //Check password meets the criteria
  const checkPasswordCriteria = () => {
    let num = false;
    let cap = false;
    //Loop through each letter of the password
    for (const c of password) {
      //Checks the password contains a number
      if (c >= "0" && c <= "9") {
        num = true;
      }
      //Checks the password contains a capital
      else if (c === c.toUpperCase()) {
        cap = true;
      }
    }
    //Returns ture or false if the password meets criteria or not
    if (num && cap && !(password.length < 8 || password.length > 20)) {
      return true;
    } else {
      return false;
    }
  };

  const handleSignUp = () => {
    //Checks password meets critera
    if (checkPassword() && checkPasswordCriteria()) {
      //Sets the data into the form
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("forename", firstName);
      formData.append("surname", surname);

      //Sends the request to the API
      fetch(
        "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/create",
        {
          //Set post and headers
          method: "POST",
          body: formData,
        }
      )
        .then((response) => {
          return response.json();
        })
        .then(
          //Handles response
          (json) => {
            //If "Success" set correct error messages to false and show the success message
            if (json.message === "Success") {
              routeChange();
            }
            //If user alreay exists
            else if (json.message === "User Already Exists") {
              setFailedSignUp(false);
              setFailedUserExists(true);
            }
            //If other issue such as missing data
            else {
              setFailedSignUp(true);
              setFailedUserExists(false);
            }
          }
        )
        //Catch any errors
        .catch((e) => {
          console.log(e.message);
        });
    }
    //If user doesnt meet password critera
    else {
      //Set corrosponding error messages
      setFailedSignUp(true);
      if (!checkPasswordCriteria()) {
        setFailedPasswordRequirements(true);
      }
    }
  };

  return (
    <div className="signupPageContainer">
      <div className="signUpForm">
        <div className="formTitle">Banquet</div>
        <div className="formTitleSub">Signup</div>
        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsername}
            required
            className="entryBox"
          />
          <label>First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={handleFirstName}
            required
            className="entryBox"
          />
          <label>Surname</label>
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={handleSurname}
            required
            className="entryBox"
          />
          <label>
            Password{" "}
            <em className="passwordHelpText">
              must contain a number, capital and be between 8 and 20 characters
            </em>
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePassword}
            required
            className="passwordBox"
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPassword}
            required
            className="passwordBox"
          />
          {
            //Return appropriate error text depending on form error
            <div className="formErrorText">
              {!failedPasswordRequirements && failedMatchingPassword
                ? "Passwords did not match"
                : failedSignUp && !failedMatchingPassword
                ? "Failed signup"
                : failedUserExists
                ? "That user already exists, please try again"
                : failedPasswordRequirements && failedMatchingPassword
                ? "Please enter a stronger password"
                : null}
            </div>
          }
          <div className="buttonContainerSignUp">
            <button type="button" className="cancelButton" onClick={backToHome}>
              Cancel
            </button>
            <button onClick={handleSignUp} className="signupButton">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
