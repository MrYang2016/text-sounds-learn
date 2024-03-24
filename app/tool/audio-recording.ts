//API to handle audio recording 

class AudioRecorder {
  /** Stores the recorded audio as Blob objects of audio data as the recording continues*/
  audioBlobs: Blob[] = [];/*of type Blob[]*/
  /** Stores the reference of the MediaRecorder instance that handles the MediaStream when recording starts*/
  mediaRecorder: MediaRecorder | null = null; /*of type MediaRecorder*/
  /** Stores the reference to the stream currently capturing the audio*/
  streamBeingCaptured: MediaStream | null = null; /*of type MediaStream*/
  /** Start recording the audio 
   * @returns {Promise} - returns a promise that resolves if audio recording successfully started
   */
  start() {
    //Feature Detection
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      //Feature is not supported in browser
      //return a custom error
      return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
    }

    else {
      //Feature is supported in browser

      //create an audio stream
      return navigator.mediaDevices.getUserMedia({ audio: true }/*of type MediaStreamConstraints*/)
        //returns a promise that resolves to the audio stream
        .then(stream /*of type MediaStream*/ => {

          //save the reference of the stream to be able to stop it when necessary
          this.streamBeingCaptured = stream;

          //create a media recorder instance by passing that stream into the MediaRecorder constructor
          this.mediaRecorder = new MediaRecorder(stream); /*the MediaRecorder interface of the MediaStream Recording
                  API provides functionality to easily record media*/

          //clear previously saved audio Blobs, if any
          this.audioBlobs = [];

          //add a dataavailable event listener in order to store the audio data Blobs when recording
          this.mediaRecorder.addEventListener("dataavailable", event => {
            //store audio Blob object
            this.audioBlobs.push(event.data);
          });

          //start the recording by calling the start method on the media recorder
          this.mediaRecorder.start();
        });

      /* errors are not handled in the API because if its handled and the promise is chained, the .then after the catch will be executed*/
    }
  };
  /** Stop the started audio recording
   * @returns {Promise} - returns a promise that resolves to the audio as a blob file
   */
  stop() {
    //return a promise that would return the blob or URL of the recording
    return new Promise<Blob>(resolve => {
      //save audio type to pass to set the Blob type
      let mimeType = this.mediaRecorder?.mimeType;

      //listen to the stop event in order to create & return a single Blob object
      this.mediaRecorder?.addEventListener("stop", () => {
        //create a single blob object, as we might have gathered a few Blob objects that needs to be joined as one
        let audioBlob = new Blob(this.audioBlobs, { type: mimeType });

        //resolve promise with the single audio blob representing the recorded audio
        resolve(audioBlob);
      });
      this.cancel();
    });
  };
  /** Cancel audio recording*/
  cancel() {
    //stop the recording feature
    this.mediaRecorder?.stop();

    //stop all the tracks on the active stream in order to stop the stream
    this.stopStream();

    //reset API properties for next recording
    this.resetRecordingProperties();
  };
  /** Stop all the tracks on the active stream in order to stop the stream and remove
   * the red flashing dot showing in the tab
   */
  stopStream() {
    //stopping the capturing request by stopping all the tracks on the active stream
    this.streamBeingCaptured?.getTracks() //get all tracks from the stream
      .forEach(track /*of type MediaStreamTrack*/ => track.stop()); //stop each one
  };
  /** Reset all the recording properties including the media recorder and stream being captured*/
  resetRecordingProperties() {
    this.mediaRecorder = null;
    this.streamBeingCaptured = null;

    /*No need to remove event listeners attached to mediaRecorder as
    If a DOM element which is removed is reference-free (no references pointing to it), the element itself is picked
    up by the garbage collector as well as any event handlers/listeners associated with it.
    getEventListeners(audioRecorder.mediaRecorder) will return an empty array of events.*/
  }
}

export const audioRecorder = new AudioRecorder();