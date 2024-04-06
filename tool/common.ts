import * as crypto from 'crypto';

export function genarateUniqueHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('base64');
}