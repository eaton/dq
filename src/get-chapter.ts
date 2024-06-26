import JSZip from 'jszip';
import { loadBook } from './load-book.js';
import { toMarkdown } from './build-markdown.js';
import * as cheerio from 'cheerio';

export type ChapterData = {
  [index: string]: unknown;
  title?: string,
  order?: number,
  headerImage?: string,
  markdown?: string,
  markup?: string,
  links?: string[],
}

/**
 * Given the `content` key from a TOC chapter entry, return the XHTML text of that chapter.
 */
export async function getChapter(input: string | JSZip, file: string) {
  const output: ChapterData = {};
  const markup = await getRawChapter(input, file);
  if (markup) {
    output.markup = markup;
    const $ = cheerio.load(markup);

    const title = $('title').text();
    if (title && !file.startsWith(title)) {
      output.title = title;
    } else {
      const h1 = $('h1').text();
      if (h1) {
        output.title = h1;
        $('h1').remove();
      }
    }

    const heading = $('div.chapterheading img, div.ch_open_img img');
    if (heading) {
      output.headerImage = heading?.attr('src') || undefined;
      $(heading).remove();
    }
    
    output.links ??= [];
    $('a[href^="http"]').each((i, link) => {
      const href = $(link)?.attr('href');
      if (href) output.links?.push(href);
    });

    output.markdown = toMarkdown($.html());
  }
  return output;
}

/**
 * Given the `content` key from a TOC chapter entry, return the XHTML text of that chapter.
 */
export async function getRawChapter(input: string | JSZip, chapter: string) {
  const zip = await loadBook(input);
  if (zip.files[`OEBPS/${chapter}`] !== undefined) {
    const xhtml = await zip.files[`OEBPS/${chapter}`].async('string');
    return xhtml;
  }
  return;
}

