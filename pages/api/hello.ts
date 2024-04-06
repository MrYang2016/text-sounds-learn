import { Request, Response } from "express";
import { startTTS } from "../../tool/TTS";

export default function handler(req: Request, res: Response) {
  startTTS('You are welcome to practice speaking!!');
  res.status(200).json({ text: 'Hello' });
}

export const runtime = 'edge';