import JSZip from 'jszip';
import jetpack from 'fs-jetpack';

/**
 * Returns a list of all the EPUB's internal files.
 */
export async function listContents(path: string) {
  return await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    })
    .then(zip => Object.keys(zip.files));
}
