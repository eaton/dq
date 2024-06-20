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
    explicitArray: false,
    charkey: 'text',
    normalize: true,
    mergeAttrs: true,
    tagNameProcessors: [
      (name: string) => name.startsWith('dc:') ? name.replace('dc:', '') : name
    ]
  });

  const dom = await parser.parseStringPromise(raw);
  return schema.parse(dom).package.metadata;
}

export async function getRawMeta(path: string) {
  return await jetpack.readAsync(path, 'buffer')
    .then(buffer => {
      if (buffer) return JSZip.loadAsync(buffer);
      throw new Error('EBook file could not be read');
    })
    .then(zip => zip.files['OEBPS/content.opf']?.async('string'));
}

const textContent = z.object({ text: z.string() }).transform(o => o.text);

const schema = z.object({
  package: z.object({
    metadata: z.object({
      title: z.string(),
      creator: textContent,
      contributor: z.array(textContent).optional(),
      publisher: z.string(),
      rights: z.string(),
      subject: z.array(z.string()),
      language: z.string(),
      identifier: textContent,
      source: z.string(),
      date: z.string()
    })
  })
});