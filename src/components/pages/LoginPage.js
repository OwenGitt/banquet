import { useState, useEffect } from "react";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../stylesheets/LoginPageStyles.css";

/**
 * Login Page
 *
 * The login page allows the user to login. A form is displayed to the user
 * where the user can enter their username and password. If correct the user
 * will be logged in, otherwise an error message will be displayed to the user.
 *
 * @author Owen Gittins
 */

export default function LoginPage(props) {
  const [username, setUsername] = useState(""); //A String to hold the username entered by the user
  const [password, setPassword] = useState(""); //A String to hold the password entered by the user
  const [textVisible, setTextVisible] = useState(false); //A Boolean to determine whether the errorText should be visible or not

  const navigate = useNavigate();
  const location = useLocation();

  //If the user successfully logs in they are redirected to the account page
  const routeChange = () => {
    let path = "/account";
    navigate(path);
  };

  //If the user clicks the cancel button they are taken back to the home page
  const backToHome = () => {
    navigate("/");
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  //If the user presses the login button, a fetch request is sent to check if the username and password are correct
  const handleLoginAttempt = () => {
    const encodedString = Buffer.from(username + ":" + password).toString(
      "base64"
    );

    fetch("http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/auth", {
      method: "POST",
      headers: new Headers({ Authorization: "Basic " + encodedString }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        //If the json returned contains a message that is "Success". Then log the user in.
        if (json.message === "Success") {
          props.handleAuthenticated(true);
          localStorage.setItem("token", json.data.token);
          routeChange();
        } else {
          //Otherwise display an error message
          setTextVisible(true);
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  //Check if the user is logged in when accessing the page
  useEffect(() => {
    if (localStorage.getItem("token")) {
      props.handleAuthenticated(true);
    }
  }, [props]);

  return (
    <div className="loginPageContainer">
      <div className="loginForm">
        <form>
          <h3 className="loginFormTitle">Banquet</h3>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            className="entryBox"
            value={username}
            onChange={handleUsername}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            className="passwordBox"
            value={password}
            onChange={handlePassword}
          />
          <div className="signupSuccessful">
            {location.state === null || textVisible === true
              ? null
              : location.state.created}
          </div>
          {location.state !== null && <div>{location.state.displayText}</div>}
          {textVisible === true && (
            <p className="loginFormErrorText">Incorrect username or password</p>
          )}

          <div>
            <button
              type="button"
              className="cancelLoginButton"
              onClick={backToHome}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLoginAttempt}
              className="loginButton"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
