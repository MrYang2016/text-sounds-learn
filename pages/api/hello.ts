import { Request, Response } from "express";
import { startTTS } from "../../tool/TTS";

export default function handler(req: Request, res: Response) {
  startTTS('Hello');
  res.status(200).json({ text: 'Hello' });
}