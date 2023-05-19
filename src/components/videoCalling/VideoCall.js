import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "./Settings.js";
import Video from "./Video";
import Controls from "./Controls";
import "./VideoCallStyles.css";

/**
 * Video Call
 *
 * The video call creates a set of controls for the video call by calling Controls. A timer is displayed next to the controls and
 * a room code is dsiplayed beneath the controls that can be clicked to copy to the user's clipboard. Beneath this the video call
 * itself is created by calling Video which is inside a container class to create a box around the video call. The current step
 * the user is on is dsiplayed between the video call and instructions, the instructions can be moved to the next or previous step
 * by clicking a button to increment or decrement the currentStep UseState value which is used to get the corresponding step in the
 * instructions UseState array. The instructions and ingredients are displayed beneath the video call and current step, inside their
 * own container.
 *
 *
 * @CodeForVideoCall A tutorial was followed to learn how to implement a video call using Agora.io link to the video - https://www.youtube.com/watch?v=lUrWJVCCVGc
 * @StopwatchCode https://medium.com/how-to-react/simple-way-to-create-a-stopwatch-in-react-js-bcc0e08e041e
 * @author Owen Gittins
 */
export default function VideoCall(props) {
  const { setInCall } = props;
  const [users, setUsers] = useState([]); //An array to hold the video call users
  const [start, setStart] = useState(false); //A Boolean for starting the video call
  const client = useClient(); //Used to create a client for the user
  const { ready, tracks } = useMicrophoneAndCameraTracks(); //Used to check if the camera and microphone are accessible, if they are tracks are set [0] for audio and [1] for video
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const hours = Math.floor(time / 360000);
  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);
  const milliseconds = time % 100;

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
  };

  useEffect(() => {
    let init = async (name) => {
      //Publish a user to a stream and access their video and audio
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            //Add the user to the list of users
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      }); //Unpublish the user from the stream upon leaving the call
      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      }); //Remove the user from the list of users upon leaving
      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      //Check to see if the client can join, if not throw an error
      try {
        await client.join(config.appId, name, config.token, null);
      } catch (error) {
        console.log("Error, could not join call");
      }
      //If the user has been published to the stream correctly and has a video and audio source then start the video call
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };
    if (ready && tracks) {
      try {
        init(channelName);
      } catch (error) {
        console.log(error);
      }
    }
  }, [channelName, client, ready, tracks]);

  //Fetch the calls recipe data from the callrecipe endpoint of the API
  useEffect(() => {
    fetch(
      "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/callrecipe?callcode=" +
        (props.callcode === "" ? props.inputCode : props.callcode)
    )
      .then((response) => response.json())
      .then((json) => {
        setIngredients(JSON.parse(json.data[0].ingredients));
        setInstructions(JSON.parse(json.data[0].instructions));
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  //Move to the next step upon button press of "Next"
  const nextStep = () => {
    if (currentStep !== instructions["instructions"].length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  //Move to the previous step upon button press of "Previous"
  const previousStep = () => {
    if (currentStep !== 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="videoCallGrid">
      <div className="controlsGrid">
        {ready && tracks && (
          <div className="controlsContainerCall">
            {/*Create the controls for the call */}
            <Controls
              tracks={tracks}
              setStart={setStart}
              setInCall={setInCall}
              callcode={props.callcode}
              users={users}
            />
            {/*Create the timer for the call */}
            <div className="timerContainer">
              <div className="timerDisplay">
                {hours}:{minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}:
                {milliseconds.toString().padStart(2, "0")}
              </div>
              <div>
                <button onClick={startStop} className="timerStartStop">
                  {isRunning ? "Stop" : "Start"}
                </button>
                <button onClick={reset} className="timerReset">
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
        {/*Display the room code that can be clicked to be copied to the clipboard */}
        <div className="roomCodeContainer">
          <div className="roomCode">{"Room Code: "}</div>
          <div
            className="roomCodeCode"
            onClick={() => {
              navigator.clipboard.writeText(props.callcode);
            }}
          >
            {props.callcode === "" ? props.inputCode : props.callcode}
          </div>
        </div>
      </div>
      {/*Create the video call grid and container */}
      <div className="videoContainer">
        {start && tracks && <Video tracks={tracks} users={users} />}
      </div>
      {/*Display the current step to the user */}
      <h4 className="currentStepTitle">Current Step</h4>
      <div className="currentInstructionContainer">
        {instructions.length === 0
          ? null
          : instructions["instructions"][currentStep].step +
            ". " +
            instructions["instructions"][currentStep].instruction}
      </div>
      <div className="stepButtons">
        <button onClick={previousStep} className="nextPrevButtons">
          Previous
        </button>
        <button onClick={nextStep} className="nextPrevButtons">
          Next
        </button>
      </div>
      {/*Create the container for the instructions and ingredients */}
      <div className="videoCallInsAndIng">
        <div className="videoCallTitleContainer">
          <div className="videoCallTitle">Ingredients</div>
          <div className="videoCallTitle">Instructions</div>
        </div>
        <div className="videoCallIngredientSection">
          <div className="videoCallInstructionsContainer">
            {ingredients.length !== 0 && (
              <div>
                <br></br>
                {ingredients["ingredients"].map((ingredient, key) => (
                  <div key={key} className="videoCallIngredient">
                    {ingredient.amount +
                      " " +
                      ingredient.unit +
                      " " +
                      ingredient.name +
                      (ingredient.preparation !== ""
                        ? " - " + ingredient.preparation
                        : "")}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="videoCallInstructionsContainer">
            {instructions.length !== 0 && (
              <div>
                {instructions["instructions"].map((step, key) => (
                  <div key={key}>
                    <div className="stepSubtitle">{"Step " + step.step}</div>
                    {step.instruction}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
