import JSZip from 'jszip';
import xml2js from 'xml2js';
const Parser = xml2js.Parser;
import { z } from 'zod';
import { loadBook } from './load-book.js';


export async function getToc(input: string | JSZip) {
  const raw = await getRawToc(input);

  const parser = new Parser({
    async: true,
    explicitArray: false,
    normalize: true,
    mergeAttrs: true,
    trim: true,
  });

  const dom = await parser.parseStringPromise(raw);
  const parsed = schema.safeParse(dom);
  if (parsed.success) {
    return parsed.data.ncx.navMap.navPoint;
  } else {
    console.log(JSON.stringify(dom, undefined, 2));
    throw parsed.error;
  }
}

export async function getRawToc(input: string | JSZip) {
  return await loadBook(input)
      .then(zip => zip.files['OEBPS/toc.ncx']?.async('string'));
}

const textContent = z.string().or(z.object({ text: z.string() }).transform(o => o.text));
const srcContent = z.string().or(z.object({ src: z.string() }).transform(o => o.src));

const navPoint = z.object({
  id: z.string(),
  playOrder: z.coerce.number(),
  navLabel: textContent,
  content: srcContent
});

const schema = z.object({
  ncx: z.object({
    // docTitle: z.string(),
    navMap: z.object({ navPoint: z.array(navPoint) })
  })
});

export type BookTocItem = z.infer<typeof navPoint>;