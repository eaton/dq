import JSZip from 'jszip';
import xml2js from 'xml2js';
const Parser = xml2js.Parser;
import { z } from 'zod';
import { loadBook } from './load-book.js';

export async function getMeta(input: string | JSZip) {
  const raw = await getRawMeta(input);

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

export async function getRawMeta(input: string | JSZip) {
  return await loadBook(input)
    .then(zip => zip.files['OEBPS/content.opf']?.async('string'));
}

const textContent = z.string().or(z.object({ text: z.string() }).transform(o => o.text));

const metadata = z.object({
  title: z.string(),
  creator: z.array(textContent).or(textContent).optional(),
  contributor: z.array(textContent).optional().optional(),
  publisher: z.string().optional(),
  rights: z.string().optional(),
  subject: z.array(z.string()).optional(),
  language: z.string(),
  identifier: textContent,
  source: z.string().optional(),
  date: z.string()
});

const schema = z.object({
  package: z.object({ metadata })
});

export type BookMetadata = z.infer<typeof metadata>;