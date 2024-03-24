import { audioRecorder } from './audio-recording';

let audioElement: HTMLVideoElement;
let audioElementSource: HTMLSourceElement;
let textIndicatorOfAudiPlaying: Element;
let microphoneButton: HTMLElement;
let recordingControlButtonsContainer: Element;
let overlay: Element;
let elapsedTimeTag: Element;

let maximumRecordingTimeInHours = 1;
let audioRecordStartTime: Date;
let elapsedTimeTimer: NodeJS.Timeout | undefined;

export function initElements() {
  audioElement = <HTMLVideoElement>document.getElementsByClassName("audio-element")[0];
  audioElementSource = document.getElementsByClassName("audio-element")[0]
    .getElementsByTagName("source")[0];
  textIndicatorOfAudiPlaying = document.getElementsByClassName("text-indication-of-audio-playing")[0];
  microphoneButton = <HTMLElement>document.getElementsByClassName("start-recording-button")[0];
  recordingControlButtonsContainer = document.getElementsByClassName("recording-contorl-buttons-container")[0];
  overlay = document.getElementsByClassName("overlay")[0];
  elapsedTimeTag = document.getElementsByClassName("elapsed-time")[0];
}

export function startAudioRecording() {

  console.log("Recording Audio...");

  //If a previous audio recording is playing, pause it
  let recorderAudioIsPlaying = !audioElement.paused; // the paused property tells whether the media element is paused or not
  console.log("paused?", !recorderAudioIsPlaying);
  if (recorderAudioIsPlaying) {
    audioElement.pause();
    //also hide the audio playing indicator displayed on the screen
    hideTextIndicatorOfAudioPlaying();
  }

  //start recording using the audio recording API
  audioRecorder.start()
    .then(() => { //on success

      //store the recording start time to display the elapsed time according to it
      audioRecordStartTime = new Date();

      //display control buttons to offer the functionality of stop and cancel
      handleDisplayingRecordingControlButtons();
    })
    .catch(error => { //on error
      //No Browser Support Error
      if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
        console.log("To record audio, use browsers like Chrome and Firefox.");
        displayBrowserNotSupportedOverlay();
      }

      //Error handling structure
      switch (error.name) {
        case 'AbortError': //error from navigator.mediaDevices.getUserMedia
          console.log("An AbortError has occured.");
          break;
        case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
          console.log("A NotAllowedError has occured. User might have denied permission.");
          break;
        case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
          console.log("A NotFoundError has occured.");
          break;
        case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
          console.log("A NotReadableError has occured.");
          break;
        case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
          console.log("A SecurityError has occured.");
          break;
        case 'TypeError': //error from navigator.mediaDevices.getUserMedia
          console.log("A TypeError has occured.");
          break;
        case 'InvalidStateError': //error from the MediaRecorder.start
          console.log("An InvalidStateError has occured.");
          break;
        case 'UnknownError': //error from the MediaRecorder.start
          console.log("An UnknownError has occured.");
          break;
        default:
          console.log("An error occured with the error name " + error.name);
      };
    });
}

function hideTextIndicatorOfAudioPlaying() {
  textIndicatorOfAudiPlaying.classList.add("hide");
}

function handleDisplayingRecordingControlButtons() {
  //Hide the microphone button that starts audio recording
  microphoneButton.style.display = "none";

  //Display the recording control buttons
  recordingControlButtonsContainer.classList.remove("hide");

  //Handle the displaying of the elapsed recording time
  handleElapsedRecordingTime();
}

function displayBrowserNotSupportedOverlay() {
  overlay.classList.remove("hide");
}

function handleElapsedRecordingTime() {
  //display inital time when recording begins
  displayElapsedTimeDuringAudioRecording("00:00");

  //create an interval that compute & displays elapsed time, as well as, animate red dot - every second
  elapsedTimeTimer = setInterval(() => {
    //compute the elapsed time every second
    let elapsedTime = computeElapsedTime(audioRecordStartTime); //pass the actual record start time
    //display the elapsed time
    displayElapsedTimeDuringAudioRecording(elapsedTime);
  }, 1000); //every second
}

function displayElapsedTimeDuringAudioRecording(elapsedTime: string) {
  //1. display the passed elapsed time as the elapsed time in the elapsedTime HTML element
  elapsedTimeTag.innerHTML = elapsedTime;

  //2. Stop the recording when the max number of hours is reached
  if (elapsedTimeReachedMaximumNumberOfHours(elapsedTime)) {
    stopAudioRecording();
  }
}

function computeElapsedTime(startTime: Date) {
  //record end time
  let endTime = new Date();

  //time difference in ms
  let timeDiff = endTime.valueOf() - startTime.valueOf();

  //convert time difference from ms to seconds
  timeDiff = timeDiff / 1000;

  //extract integer seconds that dont form a minute using %
  let seconds: string | number = Math.floor(timeDiff % 60); //ignoring uncomplete seconds (floor)

  //pad seconds with a zero if neccessary
  seconds = seconds < 10 ? "0" + seconds : seconds;

  //convert time difference from seconds to minutes using %
  timeDiff = Math.floor(timeDiff / 60);

  //extract integer minutes that don't form an hour using %
  let minutes: string | number = timeDiff % 60; //no need to floor possible incomplete minutes, becase they've been handled as seconds
  minutes = minutes < 10 ? "0" + minutes : minutes;

  //convert time difference from minutes to hours
  timeDiff = Math.floor(timeDiff / 60);

  //extract integer hours that don't form a day using %
  let hours = timeDiff % 24; //no need to floor possible incomplete hours, becase they've been handled as seconds

  //convert time difference from hours to days
  timeDiff = Math.floor(timeDiff / 24);

  // the rest of timeDiff is number of days
  let days = timeDiff; //add days to hours

  let totalHours: number | string = hours + (days * 24);
  totalHours = totalHours < 10 ? "0" + totalHours : totalHours;

  if (totalHours === "00") {
    return minutes + ":" + seconds;
  } else {
    return totalHours + ":" + minutes + ":" + seconds;
  }
}

/**
 * @param {String} elapsedTime - elapsed time in the format mm:ss or hh:mm:ss  
 * @returns {Boolean} whether the elapsed time reached the maximum number of hours or not
 */
function elapsedTimeReachedMaximumNumberOfHours(elapsedTime: string) {
  //Split the elapsed time by the symbo :
  let elapsedTimeSplitted = elapsedTime.split(":");

  //Turn the maximum recording time in hours to a string and pad it with zero if less than 10
  let maximumRecordingTimeInHoursAsString = maximumRecordingTimeInHours < 10 ? "0" + maximumRecordingTimeInHours : maximumRecordingTimeInHours.toString();

  //if it the elapsed time reach hours and also reach the maximum recording time in hours return true
  if (elapsedTimeSplitted.length === 3 && elapsedTimeSplitted[0] === maximumRecordingTimeInHoursAsString)
    return true;
  else //otherwise, return false
    return false;
}

export function stopAudioRecording() {

  console.log("Stopping Audio Recording...");

  //stop the recording using the audio recording API
  audioRecorder.stop()
    .then(audioAsblob => {
      //Play recorder audio
      playAudio(audioAsblob);

      //hide recording control button & return record icon
      handleHidingRecordingControlButtons();
    })
    .catch(error => {
      //Error handling structure
      switch (error.name) {
        case 'InvalidStateError': //error from the MediaRecorder.stop
          console.log("An InvalidStateError has occured.");
          break;
        default:
          console.log("An error occured with the error name " + error.name);
      };
    });
}

/** Plays recorded audio using the audio element in the HTML document
 * @param {Blob} recorderAudioAsBlob - recorded audio as a Blob Object 
*/
function playAudio(recorderAudioAsBlob: Blob) {

  //read content of files (Blobs) asynchronously
  let reader = new FileReader();

  //once content has been read
  reader.onload = (e) => {
    //store the base64 URL that represents the URL of the recording audio
    let base64URL = e.target?.result;

    //If this is the first audio playing, create a source element
    //as pre populating the HTML with a source of empty src causes error
    if (!audioElementSource) //if its not defined create it (happens first time only)
      createSourceForAudioElement();

    //set the audio element's source using the base64 URL
    if (typeof base64URL === 'string') {
      audioElementSource.src = base64URL;
    }

    //set the type of the audio element based on the recorded audio's Blob type
    let BlobType = recorderAudioAsBlob.type.includes(";") ?
      recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(';')) : recorderAudioAsBlob.type;
    audioElementSource.type = BlobType

    //call the load method as it is used to update the audio element after changing the source or other settings
    audioElement.load();

    //play the audio after successfully setting new src and type that corresponds to the recorded audio
    console.log("Playing audio...");
    audioElement.play();

    //Display text indicator of having the audio play in the background
    displayTextIndicatorOfAudioPlaying();
  };

  //read content and convert it to a URL (base64)
  reader.readAsDataURL(recorderAudioAsBlob);
}

/** Hide the displayed recording control buttons */
function handleHidingRecordingControlButtons() {
  //Display the microphone button that starts audio recording
  microphoneButton.style.display = "block";

  //Hide the recording control buttons
  recordingControlButtonsContainer.classList.add("hide");

  //stop interval that handles both time elapsed and the red dot
  clearInterval(elapsedTimeTimer);
}

/** Creates a source element for the the audio element in the HTML document*/
function createSourceForAudioElement() {
  let sourceElement = document.createElement("source");
  audioElement.appendChild(sourceElement);

  audioElementSource = sourceElement;
}

/** Display the text indicator of the audio being playing in the background */
function displayTextIndicatorOfAudioPlaying() {
  textIndicatorOfAudiPlaying.classList.remove("hide");
}

/** Cancel the currently started audio recording */
export function cancelAudioRecording() {
  console.log("Canceling audio...");

  //cancel the recording using the audio recording API
  audioRecorder.cancel();

  //hide recording control button & return record icon
  handleHidingRecordingControlButtons();
}

/** Displays browser not supported info box for the user*/
export function hideBrowserNotSupportedOverlay() {
  overlay.classList.add("hide");
}