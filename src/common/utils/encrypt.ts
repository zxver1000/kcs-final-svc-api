import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export const encryptAES = async (message: string): Promise<string> => {
  const iv = randomBytes(16);
  const ivString = iv.toString('hex');
  const password = process.env.AES_SECRET;

  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = (await promisify(scrypt)(password, 'tdtdsalt', 32)) as Buffer;

  const cipher = createCipheriv('aes-256-cbc', key, iv);

  let result = cipher.update(message, 'utf8', 'base64url');
  result += cipher.final('base64url');

  return ivString + '@' + result;
};

export const decryptAES = async (encryptedMessage: string): Promise<string> => {
  const parts = encryptedMessage.split('@');
  console.log(encryptedMessage);
  const iv = Buffer.from(parts[0], 'hex');

  const message = parts[1];
  const password = process.env.AES_SECRET;
  const key = (await promisify(scrypt)(password, 'tdtdsalt', 32)) as Buffer;
  const decipher = createDecipheriv('aes-256-cbc', key, iv);

  let result = decipher.update(message, 'base64url', 'utf8');
  result += decipher.final('utf8');

  return result;
};
