import { deflateSync } from 'zlib';
import { compress } from 'lzma-native';

/**
 * Compresses and encodes text using the specified algorithm.
 *
 * @param {string} text The input text to encode.
 * @param {string} algorithm The compression algorithm to use ('gzip' or 'lzma').
 * @returns {Promise<string>} A promise that resolves with the Base64 encoded string.
 */
export async function encode(text, algorithm = 'gzip') {
  const inputBuffer = Buffer.from(text, 'utf8');
  let compressedBuffer;

  switch (algorithm) {
    case 'lzma':
      compressedBuffer = await compress(inputBuffer, { preset: 9 });
      break;
    case 'gzip':
      compressedBuffer = deflateSync(inputBuffer, { level: 9 });
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}. Please use 'gzip' or 'lzma'.`);
  }

  return compressedBuffer.toString('base64');
}
