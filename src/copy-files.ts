import JSZip from 'jszip';
import jetpack from 'fs-jetpack';
import micromatch from 'micromatch';
import { parse as parsePath } from 'path';
import { utimes } from 'utimes';

export interface CopyFileOptions {
  matching?: string | string[];
  output?: string;
  preserveDates?: boolean;
  preservePath?: boolean;
}

const defaults: CopyFileOptions = {
  output: './output',
  preserveDates: true,
  preservePath: true,
};

/**
 * Copies matching items from the EPUB to real honest-to-god files.
 */
export async function copyFiles(path: string, options: CopyFileOptions = {}) {
  const opt = { ...defaults, ...options };

  const zip = await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
    });
  
  if (zip === undefined) throw new Error('EBook file could not be read');

  let filesToExtract = Object.keys(zip.files);
  if (opt.matching !== undefined) {
    filesToExtract = filesToExtract.filter(f => micromatch.isMatch(f, opt.matching!));
  }

  const output = jetpack.dir(opt.output ?? '.');
  for (const f of filesToExtract) {
    const file = zip.file(f);
    if (file) {
      const outFile = opt.preservePath ? f : parsePath(f).base;
      const buffer = await file.async('nodebuffer');
      output.write(outFile, buffer);
      if (opt.preserveDates) {
        await utimes(output.path(outFile), { btime: file.date, mtime: file.date })
      }
    }
  }
}