import JSZip from 'jszip';
import jetpack from 'fs-jetpack';

/**
 * Ensures a given input is either a functioning Zip file, or a path
 * where a zip file lives.
 * 
 * Returns a Promise for a loaded zip file.
 */
export async function loadBook(input: string | JSZip) {
  if (typeof input === 'string') {
    const zip = await jetpack.readAsync(input, 'buffer')
      .then(buffer => {
        if (buffer) return JSZip.loadAsync(buffer);
      });
    if (zip === undefined) {
      throw new Error('EBook file could not be read');
    } else {
      return zip;
    }
  } else {
    return input;
  }
}