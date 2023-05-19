import { AgoraVideoPlayer } from "agora-rtc-react";
import "./VideoStyles.css";

/**
 * Video Call - Video
 *
 * The video accepts two props. the users prop is all the users in
 * the call while the tracks prop is for handling the video and
 * audio of the user. The video works by displaying the user in the
 * top left of the page by calling the AgoraVideoPlayer and using the
 * prop tracks[1] (the video track) and using the class of videoPerson
 * to display the user in the top left of the video call.
 *
 * If the video call has more than one user, the other users will be displayed
 * in a grid format alongside and below the user using the users prop.
 *
 * @author Owen Gittins w19039374
 */

export default function Video(props) {
  const { users, tracks } = props;

  return (
    <div className={users.length === 0 ? "videoGridOnePerson" : "videoGrid"}>
      <div className="videoItem">
        <AgoraVideoPlayer videoTrack={tracks[1]} className="videoPerson" />
      </div>
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <div className="videoItem">
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  className="videoPersonOther"
                />
              </div>
            );
          } else return null;
        })}
    </div>
  );
}
