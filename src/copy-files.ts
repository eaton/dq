import JSZip from 'jszip';
import jetpack from 'fs-jetpack';
import micromatch from 'micromatch';
import { utimes } from 'utimes';
import { loadBook } from './load-book.js';

export interface CopyFileOptions {
  matching?: string | string[];
  output?: string;
  preserveDates?: boolean;
  rewritePaths?: (path: string) => string
}

const defaults: CopyFileOptions = {
  output: './output',
  preserveDates: true,
};

/**
 * Copies matching items from the EPUB to real honest-to-god files.
 */
export async function copyFiles(input: string | JSZip, options: CopyFileOptions = {}) {
  const opt = { ...defaults, ...options };
  const zip = await loadBook(input);
  
  let filesToExtract = Object.keys(zip.files);
  if (opt.matching !== undefined) {
    filesToExtract = filesToExtract.filter(f => micromatch.isMatch(f, opt.matching!));
  }

  const output = jetpack.dir(opt.output ?? '.');
  for (const f of filesToExtract) {
    const file = zip.file(f);
    if (file) {
      const outFile = opt.rewritePaths ? opt.rewritePaths(f) : f;
      const buffer = await file.async('nodebuffer');
      output.write(outFile, buffer);
      if (opt.preserveDates) {
        await utimes(output.path(outFile), { btime: file.date, mtime: file.date })
      }
    }
  }
}