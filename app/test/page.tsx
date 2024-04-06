'use client';

import React, { useState } from 'react';
import { initElements, startAudioRecording, stopAudioRecording, cancelAudioRecording } from '../tool/audio-handle';

const basicButtonClassName = 'px-4 py-1 text-sm text-sky-600 font-semibold rounded-full border border-sky-200 hover:text-white hover:bg-sky-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 shadow-lg';

export default function Home() {
  React.useEffect(() => {
    initElements();
  }, []);
  const [inRecording, setIsRecording] = useState(false);
  function handleClickStartRecord() {
    // 更新inRecording，记住这是react
    setIsRecording(true);
    startAudioRecording();
  }
  function handleClickStopRecord() {
    // 更新inRecording，记住这是react
    setIsRecording(false);
    stopAudioRecording();
  }
  return (
    <main className="flex min-h-screen flex-col items-left justify-between">
      <div className='py-8 px-8'>
        <p className="text-lg text-black font-semibold py-8">
          To learn Text Speech, use the button below to add text.
        </p>
        <button className={basicButtonClassName}>Add Text</button>
        <div>
          <ul>
            <li>
              <div className='py-10 rounded-full border border-sky-200'>
                <div className='py-10 px-1'><button className='fa fa-volume-off px-2 hover'/>You are welcome to practice speaking!!</div>
                <button className={`px-4 py-1 text-sm text-sky-600 font-semibold rounded-full border border-sky-200 hover:text-white hover:bg-sky-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 shadow-lg ${inRecording ? 'hidden' : ''}`} onClick={handleClickStartRecord}><i className='fa fa-microphone px-1'/>start to record your voice</button>
                <button className={`px-4 py-1 text-sm text-red-600 font-semibold rounded-full border border-red-200 hover:text-white hover:bg-red-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 shadow-lg ${inRecording ? '' : 'hidden'}`} onClick={handleClickStopRecord}><i className='fa fa-stop-circle-o px-1'/>stop to record your voice</button>
                <audio controls className="audio-element hide"></audio>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
