'use client';

import { startAudioRecording, stopAudioRecording, cancelAudioRecording, hideBrowserNotSupportedOverlay, initElements } from './tool/audio-handle';
import React from 'react';

export default function Home() {
  React.useEffect(() => {
    initElements()
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="audio-recording-container">
        <h1 className="title">Audio Recording API Demo</h1>
        <i className="start-recording-button fa fa-microphone" aria-hidden="true" onClick={() => startAudioRecording()}></i>
        <div className="recording-contorl-buttons-container hide">
          <i className="cancel-recording-button fa fa-times-circle-o" aria-hidden="true" onClick={() => cancelAudioRecording()}></i>
          <div className="recording-elapsed-time">
            <i className="red-recording-dot fa fa-circle" aria-hidden="true"></i>
            <p className="elapsed-time"></p>
          </div>
          <i className="stop-recording-button fa fa-stop-circle-o" aria-hidden="true" onClick={() => stopAudioRecording()}></i>
        </div>
        <div className="text-indication-of-audio-playing-container">
          <p className="text-indication-of-audio-playing hide">Audio is playing<span>.</span><span>.</span><span>.</span></p>
        </div>
      </div>
      <div className="overlay hide">
        <div className="browser-not-supporting-audio-recording-box">
          <p>To record audio, use browsers like Chrome and Firefox that support audio recording.</p>
          <button type="button" className="close-browser-not-supported-box" onClick={() => hideBrowserNotSupportedOverlay()}>Ok.</button>
        </div>
      </div>

      <audio controls className="audio-element hide">
      </audio>
    </main>
  );
}
