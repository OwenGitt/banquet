import "./App.css";
import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "./components/pages/HomePage";
import RecipesPage from "./components/pages/RecipesPage";
import Navbar from "./components/features/Navbar";
import IndividualRecipePage from "./components/pages/IndividualRecipePage";
import StartVideoCallPage from "./components/pages/StartVideoCallPage";
import Footer from "./components/features/Footer";
import "./components/stylesheets/FooterStyles.css";
import LoginPage from "./components/pages/LoginPage";
import SignUp from "./components/pages/SignupPage";
import AccountPage from "./components/pages/AccountPage";

function App() {
  //Stores the authenticated state of the user
  const [authenticated, setAuthenticated] = useState(false);
  const handleAuthenticated = (isAuthenticated) => {
    setAuthenticated(isAuthenticated);
  };

  return (
    <div className="App">
      <Navbar
        authenticated={authenticated}
        handleAuthenticated={handleAuthenticated}
      />
      <Routes>
        <Route path="/" element={<HomePage authenticated={authenticated} />} />

        <Route
          path="/recipes"
          element={
            <RecipesPage
              isAccountPage={false}
              handleAuthenticated={setAuthenticated}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/recipes/recipedata"
          element={
            <IndividualRecipePage
              backTo={"/recipes"}
              handleAuthenticated={setAuthenticated}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/call"
          element={
            <StartVideoCallPage
              handleAuthenticated={setAuthenticated}
              authenticated={authenticated}
            />
          }
        />

        <Route
          path="/login"
          element={
            <LoginPage
              handleAuthenticated={setAuthenticated}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUp
              handleAuthenticated={setAuthenticated}
              authenticated={authenticated}
            />
          }
        />
        <Route
          path="/account"
          element={
            <AccountPage
              handleAuthenticated={setAuthenticated}
              authenticated={authenticated}
              isAccountPage={true}
            />
          }
        />
        <Route
          path="/account/recipedata"
          element={<IndividualRecipePage backTo={"/recipes"} />}
          isAccountPage={true}
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
