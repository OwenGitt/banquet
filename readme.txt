### Start the app
Use `npm start` to start the web application. Some dependencies may need installing. Such as react-router-dom.
Full list:
 	"@emotion/react": "^11.10.6",
        "@emotion/styled": "^11.10.6",
        "@fontsource/source-serif-pro": "^4.5.9",
        "@fortawesome/free-solid-svg-icons": "^6.4.0",
        "@fortawesome/react-fontawesome": "^0.2.0",
        "@mui/icons-material": "^5.11.11",
        "@mui/material": "^5.11.14",
        "@testing-library/jest-dom": "^5.16.5",
        "@testing-library/react": "^13.4.0",
        "@testing-library/user-event": "^13.5.0",
        "agora-rtc-react": "^1.1.3",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.9.0",
        "react-scripts": "5.0.1",
        "react-slideshow-image": "^4.2.1",
        "simple-peer": "^9.11.1",
        "socket.io-client": "^4.6.1",
        "web-vitals": "^2.1.4"

### Video call doesn't display anything

This issue could be to do with the user either having no video camera or audio source available or accessible on their 
internet browser. Which could be caused due to settings on the browser or computer. 

Otherwise, this cannot be resolved unless a new temp code is given or the marker creates an Agora.io account. 
With an account created, navigate to the console and "My Projects" once here click "Create a Project",
 once the new project has been created, click "Configure". Once on the configuration page, enable the 
primary certificate to allow users to join channels on this project. Once enabled, scroll down to 
features and find "Temp token for audio/video call", click to generate a token and input a channel 
name of "main", then generate a token and copy the token to clipboard. Then access the Settings.js 
file in the Banquet React App, to replace the "token" constant value with the new token you created 
on Agora.io. You should now be able to access the video call.