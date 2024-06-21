import JSZip from 'jszip';
import { loadBook } from './load-book.js';
import { toMarkdown } from './build-markdown.js';
import * as cheerio from 'cheerio';

export type ChapterData = {
  [index: string]: unknown;
  title?: string,
  chapterHeading?: string,
  markdown?: string,
  xhtml?: string,
  links?: string[],
}

/**
 * Given the `content` key from a TOC chapter entry, return the XHTML text of that chapter.
 */
export async function getChapter(input: string | JSZip, chapter: string) {
  const output: ChapterData = {};
  const xhtml = await getRawChapter(input, chapter);
  if (xhtml) {
    output.xhtml = xhtml;
    const $ = cheerio.load(xhtml);

    const title = $('title');
    if (title) {
      output.title = title?.text() || undefined;
      $(title).remove();
    }

    const chapterHeading = $('div.chapterheading img');
    if (chapterHeading) {
      output.chapterHeading = chapterHeading?.attr('src') || undefined;
      $(chapterHeading).remove();
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

