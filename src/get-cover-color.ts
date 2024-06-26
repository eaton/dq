import JSZip from 'jszip';
import Jimp from 'jimp';
import { loadBook } from './load-book.js';

/**
 * Parses the cover image to find the primary color. Mein gott.
 */
export async function getCoverColor(input: string | JSZip, format: 'rgba' | 'hex' = 'rgba') {
  const zip = await loadBook(input);
  
  // So bad. My god. this is so bad.
  if (zip.files['OEBPS/image/cover.jpg'] !== undefined) {
    return await zip.files['OEBPS/image/cover.jpg']
      .async('nodebuffer')
      .then(buffer => Jimp.read(buffer))
      .then(image => image.getPixelColor(50, 500))
      .then(hex => format === 'hex' ? '#' + hex.toString(16).slice(0,6) : Jimp.intToRGBA(hex))
  } else {
    return undefined;
  }
}
