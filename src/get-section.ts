import JSZip from 'jszip';
import jetpack from 'fs-jetpack';


/**
 * Given the `content` key from a TOC section entry, return the XHTML text of that section.
 */
export async function getSection(path: string, section: string) {
  const zip = await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    });
  
  if (zip.files[`OEBPS/${section}`] !== undefined) {
    const xhtml = await zip.files[`OEBPS/${section}`].async('string');
    return xhtml;
  }
}
