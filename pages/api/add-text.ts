import { Request, Response } from "express";
import { startTTS } from "../../tool/TTS";
import Joi from "joi";
import { portResult } from "../../tool/portResult";
import { genarateUniqueHash } from "../../tool/common";
import { PrismaClient } from '@prisma/client';

export default async function handler(req: Request, res: Response) {
  const data = req.body;
  const schema = Joi.object<{ text: string }>({
    text: Joi.string().min(1).max(1000).required(),
  });
  const { error, value } = schema.validate(data);
  if (error) {
    res.status(500).json(portResult.error(error.message));
    return;
  }
  const { text } = value;
  const hash = genarateUniqueHash(text);
  const prisma = new PrismaClient();
  try {
    const result = await prisma.tts.findUnique({ where: { id: hash }, select: { id: true } });
    if (result) {
      res.status(200).json(portResult.success('The text already exists.', { hash }));
      return;
    }
    const url = startTTS(text);
    await prisma.tts.create({ data: { id: hash, text, url } });
    res.status(200).json(portResult.success('The text has been added.', { hash }));
  } catch (error) {
    res.status(500).json(portResult.error((error as Error)?.message));
  } finally {
    await prisma.$disconnect();
  }
}
