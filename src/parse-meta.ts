import JSZip from 'jszip';
import jetpack from 'fs-jetpack';
import xml2js from 'xml2js';
const Parser = xml2js.Parser;
import { z } from 'zod';

export interface MetaOptions {
}

const defaults: MetaOptions = {
}

export async function parseMeta(path: string, options: MetaOptions = {}) {
  const opt = { ...defaults, ...options };
  const raw = await getRawMeta(path);

  const parser = new Parser({
    async: true,
    // charkey: 'text',
    // trim: true,
    // normalize: true,
    // mergeAttrs: true,
  });

  const parsed = await parser.parseStringPromise(raw);
  return parsed
}

export async function getRawMeta(path: string) {
  return await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    })
    .then(zip => zip.files['OEBPS/content.opf']?.async('string'));
}
