import { useState } from "react";
import { useClient } from "./Settings";
import { Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "./ControlsStyles.css";

/**
 * Video Call - Controls
 *
 * The controls handle the controls for the video call. Muting the audio and video and leaving the call.
 * The controls accept 4 props.
 * tracks - to access the microphone and camera
 * setStart - to leave the call
 * setInCall - to leave the call
 * users - to handle people leaving the call and changing the number of users
 *
 * @author Owen Gittins w19039374
 */

export default function Controls(props) {
  const client = useClient();
  const { tracks, setStart, setInCall, users } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  //Check what is being muted by the user (audio or video) then mute that track
  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  /*If there is no one left in the channel then remove the call code from the database by using a 
  fetch request to the deletecallrecipe endpoint of the API. Then remove self from the call*/
  const leaveChannel = async () => {
    if (users.length === 0) {
      fetch(
        "http://unn-w19039374.newnumyspace.co.uk/year3/banquet/api/deletecallrecipe?callcode=" +
          props.callcode,
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
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  return (
    <div className="controls">
      <div className="controlsButton">
        <Button
          variant="contained"
          color="primary"
          onClick={() => leaveChannel()}
        >
          <ExitToAppIcon />
        </Button>
      </div>
      <div className="controlsButton">
        <Button
          variant="contained"
          color={trackState.audio ? "primary" : "secondary"}
          onClick={() => mute("audio")}
        >
          {trackState.audio ? <MicIcon /> : <MicOffIcon />}
        </Button>
      </div>
      <div className="controlsButton">
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={() => mute("video")}
        >
          {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
        </Button>
      </div>
    </div>
  );
}
