import JSZip from 'jszip';
import jetpack from 'fs-jetpack';

export async function parseToc(path: string) {
  return await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    })
    .then(zip => zip.files['OEBPS/toc.ncx']?.async('string'));
}
