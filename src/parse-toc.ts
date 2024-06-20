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
    normalize: true,
    mergeAttrs: true,
    trim: true,
  });

  const dom = await parser.parseStringPromise(raw);
  return schema.parse(dom).ncx.navMap.navPoint;
}

export async function getRawToc(path: string) {
  return await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    })
    .then(zip => zip.files['OEBPS/toc.ncx']?.async('string'));
}

const textContent = z.string().or(z.object({ text: z.string() }).transform(o => o.text));
const srcContent = z.string().or(z.object({ src: z.string() }).transform(o => o.src));

const schema = z.object({
  ncx: z.object({
    // docTitle: z.string(),
    navMap: z.object({
      navPoint: z.array(z.object({
        id: z.string(),
        playOrder: z.coerce.number(),
        navLabel: textContent,
        content: srcContent
      }))
    })
  })
});