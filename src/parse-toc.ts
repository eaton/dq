import JSZip from 'jszip';
import jetpack from 'fs-jetpack';
import xml2js from 'xml2js';
const Parser = xml2js.Parser;
import { z } from 'zod';

export interface TocOptions {
};

const defaults: TocOptions = {
}

export async function parseToc(path: string, options: TocOptions = {}) {
  const opt = { ...defaults, ...options };
  const raw = await getRawToc(path);

  const parser = new Parser({
    async: true,
    explicitArray: false,
    charkey: 'text',
    normalize: true,
    mergeAttrs: true,
    // charkey: 'text',
    // trim: true,
    // normalize: true,
    // mergeAttrs: true,
  });
  const parsed = await parser.parseStringPromise(raw);
  return parsed
}

export async function getRawToc(path: string) {
  return await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    })
    .then(zip => zip.files['OEBPS/toc.ncx']?.async('string'));
}
