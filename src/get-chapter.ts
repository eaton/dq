import JSZip from 'jszip';
import { loadBook } from './load-book.js';

/**
 * Given the `content` key from a TOC chapter entry, return the XHTML text of that chapter.
 */
export async function getChapter(input: string | JSZip, chapter: string) {
  const zip = await loadBook(input);
  if (zip.files[`OEBPS/${chapter}`] !== undefined) {
    const xhtml = await zip.files[`OEBPS/${chapter}`].async('string');
    return xhtml;
  }
  return;
}
