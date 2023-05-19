import { NavLink } from "react-router-dom";
import "../stylesheets/NavbarStyles.css";

/**
 * Navbar
 *
 * The navbar creates the navigation bar displayed at the top of every page.
 * Users can navigate between pages by clicking the links on the navbar.
 * The authenticated prop is used to determine if the user is signed in or not.
 * If the user is signed in a logout button will be displayed to the user which
 * will allow the user to logout by changing the authenticated prop and removing
 * the token.
 *
 * @author Owen Gittins
 */

function Navbar(props) {
  const handleSignOut = () => {
    props.handleAuthenticated(false);
    localStorage.removeItem("token");
  };
  return (
    <ul className="customul">
      <li className="banquetli">
        <NavLink to="/">Banquet</NavLink>
      </li>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/recipes">Recipes</NavLink>
      </li>
      <li>
        <NavLink to="/call">Cook Together</NavLink>
      </li>
      {props.authenticated === true ? (
        <li className="rightli">
          <NavLink onClick={handleSignOut} to="/">
            Logout
          </NavLink>
        </li>
      ) : null}
      {props.authenticated === true ? (
        <li className="leftli">
          <NavLink to="/account">Account</NavLink>
        </li>
      ) : null}

      {props.authenticated === true ? null : (
        <li className="rightli">
          <NavLink to="/signup">Signup</NavLink>
        </li>
      )}
      {props.authenticated === true ? null : (
        <li className="leftli">
          <NavLink to="/login">Login</NavLink>
        </li>
      )}
    </ul>
  );
}
export default Navbar;
