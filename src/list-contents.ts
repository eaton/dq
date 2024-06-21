import JSZip from 'jszip';
import { loadBook } from './load-book.js';

/**
 * Returns a list of all the EPUB's internal files.
 */
export async function listContents(input: string | JSZip) {
  return await loadBook(input)
    .then(book => Object.keys(book.files));
}
