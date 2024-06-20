import JSZip from 'jszip';
import jetpack from 'fs-jetpack';
import Jimp from 'jimp';

/**
 * Parses the cover image to find the primary color. Mein gott.
 */
export async function getCoverColor(path: string) {
  const zip = await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    });
  
  // So bad. My god. this is so bad.
  if (zip.files['OEBPS/image/cover.jpg'] !== undefined) {
    return await zip.files['OEBPS/image/cover.jpg']
      .async('nodebuffer')
      .then(buffer => Jimp.read(buffer))
      .then(image => image.getPixelColor(50, 500))
      .then(hex => Jimp.intToRGBA(hex))
  };
}
