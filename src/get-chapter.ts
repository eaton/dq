import JSZip from 'jszip';
import { loadBook } from './load-book.js';
import { toMarkdown } from './build-markdown.js';
import * as cheerio from 'cheerio';

export type ChapterData = {
  [index: string]: unknown;
  title?: string,
  order?: number,
  chapterImage?: string,
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
    // Often the title tag is just the name of the file. Don't bother including
    // it in the frontmatter if that's the case.
    if (title && !file.startsWith(title)) {
      output.title = title;
    }
    
    // The h1 tag, though, we care about that.
    const h1 = $('h1').text();
    if (h1) {
      // If the title is already set, don't over-write it.
      output.title ??= h1;
      $('h1').remove();
    }

    const img = $('div.chapterheading img, div.ch_open_img img');
    if (img) {
      output.chapterImage = img?.attr('src') || undefined;
      $(img).remove();
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

