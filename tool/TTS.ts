// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// <code>

// pull in the required packages.
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as path from "path";
// import * as readline from "readline";

// replace with your own subscription key,
// service region (e.g., "westus"), and
// the name of the file you save the synthesized audio.
const subscriptionKey = process.env.AZURE_SPEECH_KEY || "YOUR_SPEECH_SERVICE_KEY";
const serviceRegion = process.env.AZURE_SPEECH_REGION || 'YOUR_SERVICE_REGION'; // e.g., "westus"
const filename = `public/wav/txtToSound${Date.now()}.wav`;

// we are done with the setup

// now create the audio-config pointing to our stream and
// the speech config specifying the language.
const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

// create the speech synthesizer.
let synthesizer: sdk.SpeechSynthesizer | undefined = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

export function startTTS(text: string) {
  // rl.question(text, function (text) {
  console.log({ text });
  // rl.close();
  // start the synthesizer and wait for a result.
  synthesizer?.speakTextAsync(text,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error("Speech synthesis canceled, " + result.errorDetails +
          "\nDid you update the subscription info?");
      }
      synthesizer?.close();
      synthesizer = undefined;
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer?.close();
      synthesizer = undefined;
    });
  console.log("Now synthesizing to: " + filename);
  // });
}