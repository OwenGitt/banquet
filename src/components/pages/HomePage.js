import "../stylesheets/HomePageStyles.css";

/**
 * Homepage
 *
 * The homepage displays 2 images to the user and 2 sets of text. It is a basic page
 * that needs improvement, but it gives the user a basic understanding of the
 * website and what to expect.
 *
 * @author Owen Gittins
 */

function HomePage() {
  return (
    <div className="homePageContainer">
      <div className="leftImageContainer">
        <img
          src="https://images.pexels.com/photos/5957104/pexels-photo-5957104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          className="imageHome1"
          alt="Two women and a child video calling on their laptop, while cooking in the kitchen"
        ></img>
      </div>
      <div className="textArea1">
        <div className="homePageTitle">Welcome to Banquet!</div>
        <div className="borderLine"></div>
        <p>
          New to Banquet? Create an account today for free to favourite recipes,
          comment on recipes and call your friends. Head to the signup page to
          create your account now! Stay connected while doing what you love!
        </p>
      </div>
      <div className="textArea2">
        <div className="gettingStartedTitle">Getting Started</div>
        <div className="borderLine"></div>
        <p>
          Browse through our wide range of recipes, we're sure you'll find
          something you'll love! Once you have found the recipe you are looking
          for click the "use this recipe now" button, then start a call, invite
          your friend and get cooking with them. Share the joy of cooking and
          tasty food with others while practicing your skills. Note: Cooking
          times and temperatures may vary depending on the equipment and
          ingredients used, so it's always a good idea to adjust the recipe
          accordingly and use your best judgement while cooking.
        </p>
      </div>
      <div className="rightImageContainer">
        <img
          src="https://images.pexels.com/photos/5956812/pexels-photo-5956812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          className="imageHome2"
          alt="A woman video calling another woman while cooking in the kitchen"
        ></img>
      </div>
    </div>
  );
}
export default HomePage;
