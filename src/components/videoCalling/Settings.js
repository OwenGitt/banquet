import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

/**
 * Video Call - Settings
 *
 * The settings import the agora-rtc-react (available at - https://github.com/AgoraIO-Community/Agora-RTC-React).
 * The appId refers to the appId used on the Agora.io website for hosting this video call. The token is used to
 * connect to a channel (the 'main' channel) created on Agora.io within the project that is hosted on Agora.io. These are then used
 * for the configuration of the video call to create a client and the camera and microphone of the user are accessed.
 * The channelName refers to the the channel that is to be connected to. In this case - 'main'.
 *
 * @author Owen Gittins w19039374
 */

const appId = "530da433d8b44e1c80ce1703d12f92c1";
const token =
  "007eJxTYLgqPvGETezCSqbOLfXfb6ZJn9KpfR+6vO4T+/Nd6ydGti9UYDA1NkhJNDE2TrFIMjFJNUy2MEhONTQ3ME4xNEqzNEo2ZIhyS2kIZGR4eXEdAyMUgvgsDLmJmXkMDACzcyC5";

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };

export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
